"""A coordinate label may stand more than LABEL_DISTANCE (72 px) from its dot only when a leader of its own dot reaches its box.

The two observers (ellipse_figure_observer, conic_figure_observer) measure the leader line's two ends
themselves; the data-* attributes on the line are never trusted. The fixtures are real engine output
(a 금당고 pair of ellipses with A(0,4), a 매산고 hyperbola with N(0,-1/2)): both stand farther than 72 px
from their dot and PASS because a leader joins them to it.
"""
import re
import sys
import unittest
from pathlib import Path

PRODUCTION=Path(__file__).resolve().parents[1]/'production'
FIXTURES=Path(__file__).resolve().parent/'fixtures'/'point-leaders'
sys.path.insert(0,str(PRODUCTION))
import json
import ellipse_figure_observer as O
import conic_figure_observer as CO

CASES=[('geumdang-q20','A'),('maesan-q16','N')]
OBSERVERS=[('ellipse',O),('conic',CO)]
NUM=r'(-?[0-9.]+)'


def load(name):
    plan=json.loads((FIXTURES/(name+'.plan.json')).read_text(encoding='utf8'))
    svg=(FIXTURES/(name+'.svg')).read_text(encoding='utf8')
    return plan,svg


def label_tag(svg,pid):
    return re.search(r'<g id="label-point-%s"[^>]*>'%pid,svg).group(0)


def label_box(svg,pid):
    return [float(v) for v in re.search(r'data-box="([^"]+)"',label_tag(svg,pid)).group(1).split(',')]


def dot(svg,pid):
    match=re.search(r'<circle[^>]*data-point="%s"[^>]*cx="%s"[^>]*cy="%s"'%(pid,NUM,NUM),svg)
    return float(match.group(1)),float(match.group(2))


def leader_tag(svg,pid):
    return re.search(r'<line id="leader-point-%s"[^>]*/>'%pid,svg).group(0)


def without_leader(svg,pid):
    return svg.replace(leader_tag(svg,pid),'')


def box_reach(svg,pid):
    x,y,w,h=label_box(svg,pid);ex,ey=dot(svg,pid)
    return (max(x-ex,0,ex-(x+w))**2+max(y-ey,0,ey-(y+h))**2)**0.5


def moved(svg,pid,dy):
    """The label (and, with follow=True semantics left to the caller, only the label) shifted vertically by dy px."""
    tag=label_tag(svg,pid);x,y,w,h=label_box(svg,pid)
    new=re.sub(r'data-box="[^"]+"','data-box="%s,%s,%s,%s"'%(x,y+dy,w,h),tag)
    new=re.sub(r'translate\([^)]+\)','translate(%s %s)'%(x,y+dy),new)
    return svg.replace(tag,new)


def set_leader(svg,pid,**ends):
    tag=leader_tag(svg,pid);new=tag
    for key,value in ends.items():
        new=re.sub(r'%s="[^"]+"'%key,'%s="%s"'%(key,value),new)
    return svg.replace(tag,new)


def leader_ends(svg,pid):
    tag=leader_tag(svg,pid)
    return [float(re.search(r'%s="([^"]+)"'%k,tag).group(1)) for k in ('x1','y1','x2','y2')]


def away(svg,pid):
    """+1 when the label stands below its dot, -1 above: the direction that takes it farther from the dot."""
    x,y,w,h=label_box(svg,pid);return 1 if y+h/2>dot(svg,pid)[1] else -1


class PointLabelLeaderTest(unittest.TestCase):
    def errors(self,observer,name,svg):
        plan,_=load(name)
        return observer.audit(plan,svg)['errors']

    def test_the_real_figures_stand_beyond_72_px_and_pass(self):
        for name,pid in CASES:
            plan,svg=load(name)
            self.assertGreater(box_reach(svg,pid),O.LABEL_DISTANCE,name)
            for label,observer in OBSERVERS:
                result=observer.audit(plan,svg)
                self.assertEqual(result['status'],'PASS',(name,label,result['errors']))

    def test_no_leader_means_too_far(self):
        for name,pid in CASES:
            _,svg=load(name)
            bare=without_leader(svg,pid)
            for label,observer in OBSERVERS:
                self.assertIn('LABEL_TOO_FAR:'+pid,self.errors(observer,name,bare),(name,label))

    def test_a_label_pushed_to_about_100_px_with_no_leader_fails(self):
        for name,pid in CASES:
            _,svg=load(name)
            pushed=svg;step=away(svg,pid)
            while box_reach(pushed,pid)<100.0: pushed=moved(pushed,pid,step)
            pushed=without_leader(pushed,pid)
            self.assertTrue(100.0<=box_reach(pushed,pid)<=O.POINT_LEADER_MAX,box_reach(pushed,pid))  # inside the 120 px the old observer allowed, so only the missing leader can fail it
            for label,observer in OBSERVERS:
                self.assertIn('LABEL_TOO_FAR:'+pid,self.errors(observer,name,pushed),(name,label))

    def test_a_leader_that_ends_at_another_dot_fails(self):
        for name,pid in CASES:
            _,svg=load(name)
            x1,y1,x2,y2=leader_ends(svg,pid)
            others=[(m.group(1),float(m.group(2)),float(m.group(3))) for m in re.finditer(r'<circle[^>]*data-point="([A-Z])"[^>]*cx="%s"[^>]*cy="%s"'%(NUM,NUM),svg) if m.group(1)!=pid]
            self.assertTrue(others,name)
            _,ox,oy=others[0]
            # the leader keeps its label end and its data-owner-point=pid but now stops 5 px short of a different dot
            dx,dy=x1-ox,y1-oy;norm=(dx*dx+dy*dy)**0.5
            lying=set_leader(svg,pid,x2=ox+dx/norm*5.0,y2=oy+dy/norm*5.0)
            for label,observer in OBSERVERS:
                self.assertIn('LABEL_TOO_FAR:'+pid,self.errors(observer,name,lying),(name,label))

    def test_a_leader_that_does_not_start_at_the_label_fails(self):
        for name,pid in CASES:
            _,svg=load(name)
            x1,y1,_,_=leader_ends(svg,pid)
            detached=set_leader(svg,pid,x1=x1-30.0,y1=y1-30.0)  # 30 px off the label's corner, outside its box
            for label,observer in OBSERVERS:
                self.assertIn('LABEL_TOO_FAR:'+pid,self.errors(observer,name,detached),(name,label))

    def test_a_leader_that_stops_far_from_its_dot_fails(self):
        for name,pid in CASES:
            _,svg=load(name)
            x1,y1,x2,y2=leader_ends(svg,pid)
            dx,dy=x1-x2,y1-y2;norm=(dx*dx+dy*dy)**0.5
            short=set_leader(svg,pid,x2=x2+dx/norm*20.0,y2=y2+dy/norm*20.0)
            for label,observer in OBSERVERS:
                self.assertIn('LABEL_TOO_FAR:'+pid,self.errors(observer,name,short),(name,label))

    def test_a_label_beyond_120_px_fails_even_with_its_leader(self):
        for name,pid in CASES:
            _,svg=load(name)
            far=svg;push=0.0;step=away(svg,pid)
            while box_reach(far,pid)<125.0: far=moved(far,pid,step);push+=step
            x1,y1,_,_=leader_ends(svg,pid)
            far=set_leader(far,pid,y1=y1+push)
            self.assertGreater(box_reach(far,pid),O.POINT_LEADER_MAX,name)
            for label,observer in OBSERVERS:
                self.assertIn('LABEL_TOO_FAR:'+pid,self.errors(observer,name,far),(name,label))


if __name__=='__main__':
    unittest.main()
