from pathlib import Path
import math
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(r"C:/Users/USER/Desktop/AP------")
OUT = ROOT / "archive" / "assets" / "images"

def font(size=20, bold=False):
    candidates = [
        r"C:/Windows/Fonts/malgunbd.ttf" if bold else r"C:/Windows/Fonts/malgun.ttf",
        r"C:/Windows/Fonts/arial.ttf",
    ]
    for p in candidates:
        if Path(p).exists():
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def svg_doc(body, width=760, height=500):
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 %d %d">'
        '<rect width="100%%" height="100%%" fill="white"/>%s</svg>'
    ) % (width, height, width, height, body)

def text(x, y, s, size=18, anchor="middle", weight="normal"):
    return '<text x="%g" y="%g" text-anchor="%s" font-family="Arial, Malgun Gothic, sans-serif" font-size="%d" font-weight="%s" fill="black">%s</text>' % (x, y, anchor, size, weight, esc(s))

def line(x1, y1, x2, y2, dash=None, width=2):
    extra = ' stroke-dasharray="6,5"' if dash else ''
    return '<line x1="%g" y1="%g" x2="%g" y2="%g" stroke="black" stroke-width="%g"%s/>' % (x1, y1, x2, y2, width, extra)

def circle(cx, cy, r, fill="white", width=2):
    return '<circle cx="%g" cy="%g" r="%g" fill="%s" stroke="black" stroke-width="%g"/>' % (cx, cy, r, fill, width)

def write_svg(folder, name, body, width=760, height=500):
    folder.mkdir(parents=True, exist_ok=True)
    (folder / name).write_text(svg_doc(body, width, height), encoding="utf-8")

def axes(x0=90, y0=410, x1=700, y1=60, labels=True):
    out = line(x0, y0, x1, y0, width=2) + line(x0, y0, x0, y1, width=2)
    out += text(x1 + 12, y0 + 6, "x", 18, "start") + text(x0 - 8, y1 - 8, "y", 18, "end")
    if labels:
        for i in range(1, 7):
            xx = x0 + i * 80
            out += line(xx, y0 - 5, xx, y0 + 5, width=1) + text(xx, y0 + 24, str(i), 13)
        for i in range(1, 4):
            yy = y0 - i * 80
            out += line(x0 - 5, yy, x0 + 5, yy, width=1) + text(x0 - 16, yy + 5, str(i), 13, "end")
    return out

def coordinate_triangle(folder, name, centroid=False):
    if centroid:
        # This variant uses the actual coordinates from the stem.  Keep the
        # tick positions on the same transform as the plotted points (the
        # earlier generic axes helper used a different x scale and made C(4,10)
        # appear at the wrong tick).
        x0, y0, x1, y1 = 120, 410, 700, 80
        sx, sy = 100, 28
        body = line(x0, y0, x1, y0, width=2) + line(x0, y0, x0, y1, width=2)
        body += text(x1 + 12, y0 + 6, "x", 18, "start") + text(x0 - 8, y1 - 8, "y", 18, "end")
        for i in range(1, 6):
            xx = x0 + i * sx
            body += line(xx, y0 - 5, xx, y0 + 5, width=1) + text(xx, y0 + 24, str(i), 13)
        for i in range(-2, 11, 2):
            yy = y0 - i * sy
            if y1 <= yy <= y0:
                body += line(x0 - 5, yy, x0 + 5, yy, width=1) + text(x0 - 16, yy + 5, str(i), 13, "end")
        def p(x, y):
            return x0 + x * sx, y0 - y * sy
    else:
        body = axes()
        sx, sy = 80, 80
        def p(x, y):
            return 90 + x * sx, 410 - y * sy
    if centroid:
        A, B, C, G = p(2, 1), p(0, -2), p(4, 10), p(2, 3)
        H = p(1.1, 1.3)
        body += line(*A, *B) + line(*B, *C) + line(*C, *A)
        body += line(*A, *H, dash=True) + circle(*G, 6, "black") + circle(*H, 5, "black")
        body += text(A[0]-12, A[1]-12, "A") + text(B[0]-12, B[1]+18, "B") + text(C[0]+14, C[1], "C")
        body += text(G[0]+15, G[1]-8, "G") + text(H[0]+15, H[1]-8, "H")
        body += text(90, 132, "10", 13, "end") + text(C[0]+14, C[1]+20, "C(4,10)", 15, "start")
    else:
        A, B, C, H = p(2, 4), p(0, 0), p(6, 0), p(3, 3)
        body += line(*A, *B) + line(*B, *C) + line(*C, *A)
        body += line(*A, *p(2, 0), dash=True) + line(*B, *H, dash=True)
        body += circle(*A, 6, "black") + circle(*B, 6, "black") + circle(*C, 6, "black") + circle(*H, 5, "black")
        body += text(A[0]+14, A[1]-10, "A") + text(B[0]-14, B[1]+22, "B") + text(C[0]+14, C[1]+22, "C") + text(H[0]+14, H[1]-10, "H")
    write_svg(folder, name, body)

def circle_tangent(folder, name):
    # Coordinate scale: O=(0,0), radius 4, A=(12,0).
    ox, oy, sc = 100, 310, 30
    cx, cy, r = ox, oy, 4*sc
    body = line(ox, oy, ox+14*sc, oy, width=2) + line(ox, oy, ox, oy-8*sc, width=2)
    for val in (4,8,12):
        xx = ox + val*sc
        body += line(xx, oy-5, xx, oy+5, width=1) + text(xx, oy+24, str(val), 13)
    body += text(ox+14*sc+10, oy+6, "x", 18, "start") + text(ox-10, oy-8*sc-8, "y", 18, "end")
    body += circle(cx, cy, r, "white", 3) + circle(cx, cy, 5, "black")
    ax, ay = ox+12*sc, oy
    body += circle(ax, ay, 7, "black") + text(ax, ay-16, "A(12,0)", 17)
    # tangent points are symmetric and line segments stop at the circle
    tx0 = ox + (4*4/12)*sc
    ty0 = math.sqrt((4*sc)**2 - (tx0-ox)**2)
    for tx, ty in [(tx0, oy-ty0), (tx0, oy+ty0)]:
        body += line(ax, ay, tx, ty, width=2) + circle(tx, ty, 5, "black")
    body += text(cx+18, cy+24, "O(0,0)", 17) + text(tx0+18, oy-ty0-10, "T1", 15) + text(tx0+18, oy+ty0+18, "T2", 15)
    body += text(380, 465, "x^2+y^2=16,  A=(12,0)", 18)
    write_svg(folder, name, body)

def venn(folder, name):
    body = '<defs><clipPath id="clipA"><circle cx="290" cy="260" r="125"/></clipPath><clipPath id="clipBC"><path d="M0 0H760V500H0Z"/></clipPath><pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(25)"><line x1="0" y1="0" x2="0" y2="8" stroke="black" stroke-width="2"/></pattern></defs>'
    body += circle(290, 260, 125, "white", 3) + circle(430, 260, 125, "white", 3) + circle(360, 165, 125, "white", 3)
    # A∩(B∪C): hatch the union of B and C clipped by A.
    body += '<g clip-path="url(#clipA)"><circle cx="430" cy="260" r="125" fill="url(#hatch)" stroke="none"/><circle cx="360" cy="165" r="125" fill="url(#hatch)" stroke="none"/></g>'
    body += text(220, 260, "A", 22) + text(500, 260, "B", 22) + text(360, 105, "C", 22)
    write_svg(folder, name, body)

def mapping(folder, name, left, right, arrows, title="f"):
    body = text(180, 50, "X", 20, weight="bold") + text(580, 50, "Y", 20, weight="bold")
    for i, s in enumerate(left):
        y = 105 + i * 75
        body += circle(180, y, 22, "white", 2) + text(180, y+6, s, 16)
    for i, s in enumerate(right):
        y = 105 + i * 75
        body += circle(580, y, 22, "white", 2) + text(580, y+6, s, 16)
    for a, b in arrows:
        ya = 105 + left.index(str(a)) * 75
        yb = 105 + right.index(str(b)) * 75
        body += line(205, ya, 555, yb, width=2)
        body += '<polygon points="555,%g 542,%g 542,%g" fill="black"/>' % (yb, yb-6, yb+6)
    body += text(380, 440, title, 18)
    write_svg(folder, name, body)

def function_identity(folder, name, f5=8, f4=7, chain=False):
    body = axes(90, 420, 700, 70)
    # monotone polyline with markers; identity diagonal
    body += line(110, 390, 650, 90, dash=True, width=2)
    p4 = (90 + 4*80, 420 - f4*40)
    p5 = (90 + 5*80, 420 - f5*40)
    body += '<path d="M110 390 L%g %g L%g %g L650 105" fill="none" stroke="black" stroke-width="3"/>' % (p4[0], p4[1], p5[0], p5[1])
    if chain:
        for px, py, label in [(250,300,"c"),(390,230,"d"),(530,160,"e")]:
            body += circle(px, py, 6, "black") + text(px+15, py-10, label, 18, "start")
        body += text(380, 125, "c → d → e", 20)
    else:
        for x, y, label in [(5, f5, "f(5)=8"), (4, f4, "f(4)=7")]:
            px, py = 90 + x*80, 420 - y*40
            body += circle(px, py, 6, "black") + text(px+22, py-12, label, 15, "start")
    write_svg(folder, name, body)

def rational_graph(folder, name, radical=False, asymptote_x=-2, asymptote_y=0.5):
    body = axes(100, 420, 700, 70)
    ax = 380 if asymptote_x == -2 else 350
    ay = 240 if asymptote_y == 0.5 else 190
    body += line(ax, 70, ax, 420, dash=True, width=2) + line(100, ay, 700, ay, dash=True, width=2)
    body += text(ax+12, 88, "x=" + str(asymptote_x), 15, "start") + text(690, ay-12, "y=" + str(asymptote_y), 15, "end")
    # two visible rational branches around asymptotes
    body += '<path d="M130 115 C210 145 270 180 350 220" fill="none" stroke="black" stroke-width="3"/>'
    body += '<path d="M410 260 C485 300 560 350 680 390" fill="none" stroke="black" stroke-width="3"/>'
    if radical:
        body += '<path d="M420 370 C480 320 550 280 660 250" fill="none" stroke="black" stroke-width="2"/>'
    write_svg(folder, name, body)

def actual_rational_graph(folder, name, kind):
    body = axes(100, 420, 700, 70)
    if kind == "gfinal":
        # y=(2x+1)/(x+1), asymptotes x=-1,y=2
        body += line(350, 70, 350, 420, dash=True, width=2) + line(100, 190, 700, 190, dash=True, width=2)
        body += text(362, 88, "x=-1", 15, "start") + text(690, 178, "y=2", 15, "end")
        body += '<path d="M120 170 C190 176 255 183 330 188" fill="none" stroke="black" stroke-width="3"/>'
        body += '<path d="M370 210 C455 235 550 285 680 370" fill="none" stroke="black" stroke-width="3"/>'
        body += '<path d="M390 395 C455 355 535 305 680 255" fill="none" stroke="black" stroke-width="2"/>'
        body += text(120, 455, "y=(2x+1)/(x+1)", 18, "start") + text(120, 480, "y=√(2x+1)+1", 18, "start")
    elif kind == "sfinal":
        # y=(x+3)/(2x+4), asymptotes x=-2,y=1/2
        body += line(380, 70, 380, 420, dash=True, width=2) + line(100, 240, 700, 240, dash=True, width=2)
        body += text(392, 88, "x=-2", 15, "start") + text(690, 228, "y=1/2", 15, "end")
        body += '<path d="M120 185 C210 205 290 225 365 238" fill="none" stroke="black" stroke-width="3"/>'
        body += '<path d="M395 242 C470 255 560 275 680 310" fill="none" stroke="black" stroke-width="3"/>'
        body += text(120, 465, "y=(x+3)/(2x+4)", 18, "start")
    elif kind == "hfinal":
        # y=4/(x+1)+2 with radical endpoint x=1,y=2
        body += line(350, 70, 350, 420, dash=True, width=2) + line(100, 190, 700, 190, dash=True, width=2)
        body += text(362, 88, "x=-1", 15, "start") + text(690, 178, "y=2", 15, "end")
        body += '<path d="M120 90 C190 110 260 145 330 184" fill="none" stroke="black" stroke-width="3"/>'
        body += '<path d="M370 205 C455 245 560 310 680 390" fill="none" stroke="black" stroke-width="3"/>'
        body += '<path d="M430 190 C500 245 575 325 680 405" fill="none" stroke="black" stroke-width="2"/>'
        body += circle(430, 190, 6, "black") + text(445, 178, "(1,2)", 15, "start")
        body += text(120, 465, "y=4/(x+1)+2", 18, "start")
    write_svg(folder, name, body)

def path_points(points, width=3):
    if not points:
        return ""
    d = ""
    started = False
    for x, y in points:
        inside = 55 <= x <= 715 and 45 <= y <= 475
        if not inside:
            started = False
            continue
        if not started:
            d += " M%g %g" % (x, y)
            started = True
        else:
            d += " L%g %g" % (x, y)
    if not d:
        return ""
    return '<path d="%s" fill="none" stroke="black" stroke-width="%g"/>' % (d, width)

def sampled_graph(folder, name, kind):
    # Explicit coordinate transforms keep every plotted value tied to the stem.
    ox, oy, sx, sy = 330, 350, 42, 35
    if kind == "p_q19":
        ox, oy, sx, sy = 300, 320, 55, 28
    body = line(70, oy, 710, oy, width=2) + line(ox, 60, ox, 470, width=2)
    body += text(715, oy+6, "x", 18, "start") + text(ox-8, 55, "y", 18, "end")
    for v in range(-5, 9):
        xx = ox + v*sx
        if 70 <= xx <= 710:
            body += line(xx, oy-4, xx, oy+4, width=1) + text(xx, oy+20, str(v), 11)
    for v in range(-4, 9):
        yy = oy - v*sy
        if 60 <= yy <= 470:
            body += line(ox-4, yy, ox+4, yy, width=1) + text(ox-12, yy+4, str(v), 11, "end")
    def xy(x, y):
        return ox+x*sx, oy-y*sy
    if kind == "g_q16":
        body += line(*xy(-1,-4), *xy(-1,8), dash=True, width=2) + line(*xy(-6,2), *xy(8,2), dash=True, width=2)
        rat1=[]; rat2=[]; rad=[]
        for i in range(180):
            x=-7 + i*5.99/179
            rat1.append(xy(x, (2*x+1)/(x+1)))
        for i in range(180):
            x=-0.99 + i*8.99/179
            rat2.append(xy(x, (2*x+1)/(x+1)))
        for i in range(120):
            x=-0.5 + i*8.5/119
            rad.append(xy(x, math.sqrt(max(0,2*x+1))+1))
        body += path_points(rat1) + path_points(rat2) + path_points(rad,2)
        body += text(80, 490, "y=(2x+1)/(x+1),  y=√(2x+1)+1", 17, "start")
    elif kind == "s_q13":
        body += line(*xy(-2,-4), *xy(-2,8), dash=True, width=2) + line(*xy(-7,0.5), *xy(8,0.5), dash=True, width=2)
        a=[]; b=[]
        for i in range(180):
            x=-7 + i*4.99/179
            a.append(xy(x, (x+3)/(2*x+4)))
        for i in range(180):
            x=-1.99 + i*9.99/179
            b.append(xy(x, (x+3)/(2*x+4)))
        body += path_points(a) + path_points(b)
        body += text(80, 490, "y=(x+3)/(2x+4),  asymptotes x=-2,y=1/2", 17, "start")
    elif kind == "j_q12":
        body += line(*xy(-3,-3), *xy(7,7), dash=True, width=2)
        curve = [xy(-2,-1), xy(0,1), xy(2,3), xy(4,7), xy(5,8), xy(7,10)]
        body += path_points(curve)
        for x,y,label in [(4,7,"(4,7)"),(5,8,"(5,8)")]:
            px,py=xy(x,y)
            body += circle(px,py,6,"black") + text(px+10,py-10,label,16,"start")
        body += text(80, 490, "y=f(x), y=x", 17, "start")
    elif kind == "j_q17":
        # two exact radical curves and the square A=(3/4,3/2), D=(9/4,3/2)
        a=[]; b=[]
        for i in range(160):
            x=i*4/159
            a.append(xy(x, math.sqrt(3*x)))
            b.append(xy(x, math.sqrt(x)))
        body += path_points(a) + path_points(b,2)
        A=xy(0.75,1.5); D=xy(2.25,1.5); B=xy(0.75,0); C=xy(2.25,0)
        body += line(*A,*D) + line(*D,*C) + line(*C,*B) + line(*B,*A)
        for pnt,label in [(A,"A(3/4,3/2)"),(D,"D(9/4,3/2)"),(B,"B"),(C,"C")]:
            body += circle(*pnt,5,"black") + text(pnt[0]+10,pnt[1]-8 if label.startswith(("A","D")) else pnt[1]+18,label,14,"start")
        body += text(80, 490, "y=√(3x), y=√x", 17, "start")
    elif kind == "p_q19":
        body += line(*xy(1,-5), *xy(1,4), dash=True, width=1)
        curve=[]
        for i in range(180):
            x=-2 + i*6/179
            curve.append(xy(x,x*x-2*x-3))
        body += path_points(curve)
        for x,y,label in [(-1,0,"(-1,0)"),(3,0,"(3,0)"),(1,-4,"V(1,-4)")]:
            px,py=xy(x,y); body += circle(px,py,5,"black") + text(px+10,py-10,label,15,"start")
        body += text(80, 490, "f(x)=x^2−2x−3", 17, "start")
    elif kind == "h_q13":
        body += line(*xy(-1,-4), *xy(-1,8), dash=True, width=2) + line(*xy(-6,2), *xy(8,2), dash=True, width=2)
        rat1=[]; rat2=[]; rad=[]
        for i in range(180):
            x=-7 + i*5.99/179
            rat1.append(xy(x, 4/(x+1)+2))
        for i in range(180):
            x=-0.99 + i*8.99/179
            rat2.append(xy(x, 4/(x+1)+2))
        for i in range(140):
            x=1 + i*7/139
            rad.append(xy(x, -math.sqrt(4*(x-1))+2))
        body += path_points(rat1) + path_points(rat2) + path_points(rad,2)
        body += circle(*xy(1,2),6,"black") + text(xy(1,2)[0]+10,xy(1,2)[1]-10,"(1,2)",15,"start")
        body += text(80, 490, "y=4/(x+1)+2, y=−√(4(x−1))+2", 17, "start")
    write_svg(folder, name, body)

def proof_png(folder, name):
    im = Image.new("RGB", (1100, 620), "white")
    d = ImageDraw.Draw(im)
    h1, h2, h3 = font(26, True), font(21), font(18)
    d.text((35, 25), "홀수 a,b에 대한 증명 과정  (m=8a+b, n=4a+b)", fill="black", font=h1)
    rows = [
        ("가", "m-n", ""),
        ("나", "m의 나머지 - n의 나머지", ""),
        ("다", "모순의 나머지", ""),
    ]
    y = 110
    for label, lhs, rhs in rows:
        d.rectangle((40, y, 1060, y+115), outline="black", width=3)
        d.text((75, y+35), "(" + label + ")", fill="black", font=h2)
        d.text((200, y+35), lhs, fill="black", font=h2)
        d.line((430, y+57, 500, y+57), fill="black", width=3)
        if rhs:
            d.text((540, y+35), rhs, fill="black", font=h3)
        y += 145
    d.text((40, 565), "8로 나눈 나머지를 비교하여 모순을 얻는다.", fill="black", font=h2)
    folder.mkdir(parents=True, exist_ok=True)
    im.save(folder / name, "PNG")

def radical_graph(folder, name, endpoint=(4,2), two=False, reverse=False):
    body = axes(100, 420, 700, 70)
    x, y = endpoint
    px, py = 100 + x*90, 420 - y*70
    if reverse:
        body += '<path d="M%g %g C%g %g %g %g %g %g" fill="none" stroke="black" stroke-width="3"/>' % (px, py, px-50, py-75, px-130, py-105, px-220, py-125)
    else:
        body += '<path d="M%g %g C%g %g %g %g %g %g" fill="none" stroke="black" stroke-width="3"/>' % (px, py, px+50, py-75, px+130, py-105, px+220, py-125)
    if two:
        body += '<path d="M%g %g C%g %g %g %g %g %g" fill="none" stroke="black" stroke-width="2"/>' % (px, py+80, px+55, py+10, px+135, py-25, px+220, py-60)
    body += circle(px, py, 6, "black") + text(px+12, py+22, "(" + str(endpoint[0]) + "," + str(endpoint[1]) + ")", 16, "start")
    write_svg(folder, name, body)

def radical_left_actual(folder, name):
    """Exact graph for f(x)=sqrt(4-x)+2, x<=4.

    The endpoint (4,2) is the right-most point; sampling the formula rather
    than drawing a generic Bezier keeps the asset tied to the generated stem.
    """
    ox, oy, sx, sy = 400, 360, 55, 45
    body = line(70, oy, 710, oy, width=2) + line(ox, 55, ox, 465, width=2)
    body += text(715, oy + 6, "x", 18, "start") + text(ox - 8, 50, "y", 18, "end")
    for v in (-6, -4, -2, 0, 2, 4):
        xx = ox + v * sx
        if 70 <= xx <= 710:
            body += line(xx, oy - 5, xx, oy + 5, width=1) + text(xx, oy + 23, str(v), 12)
    for v in (1, 2, 3, 4, 5, 6):
        yy = oy - v * sy
        if 55 <= yy <= 465:
            body += line(ox - 5, yy, ox + 5, yy, width=1) + text(ox - 14, yy + 4, str(v), 12, "end")
    pts = []
    for i in range(241):
        x = -6 + 10 * i / 240
        y = math.sqrt(max(0.0, 4 - x)) + 2
        px, py = ox + x * sx, oy - y * sy
        if 55 <= px <= 715 and 45 <= py <= 475:
            pts.append((px, py))
    body += path_points(pts, 3)
    ep = (ox + 4 * sx, oy - 2 * sy)
    f0 = (ox, oy - 4 * sy)
    body += circle(*ep, 6, "black") + text(ep[0] + 12, ep[1] + 22, "(4,2)", 16, "start")
    body += circle(*f0, 5, "black") + text(f0[0] + 12, f0[1] - 10, "(0,4)", 15, "start")
    body += text(80, 490, "y=√(4−x)+2,  x≤4", 18, "start")
    write_svg(folder, name, body)

def radical_square(folder, name):
    body = axes(100, 420, 700, 70)
    # scale x=90, y=95; A=(3/4,3/2), D=(9/4,3/2)
    def p(x, y):
        return 220 + x*90, 420 - y*95
    A, D = p(0.75,1.5), p(2.25,1.5)
    B, C = p(0.75,0), p(2.25,0)
    body += '<path d="M%g %g C%g %g %g %g %g %g" fill="none" stroke="black" stroke-width="3"/>' % (p(0,0)[0],p(0,0)[1],p(0.8,0.8)[0],p(0.8,0.8)[1],p(2.5,1.5)[0],p(2.5,1.5)[1],p(4,2)[0],p(4,2)[1])
    body += '<path d="M%g %g C%g %g %g %g %g %g" fill="none" stroke="black" stroke-width="2"/>' % (p(0,0)[0],p(0,0)[1]+25,p(1,0.8)[0],p(1,0.8)[1]+25,p(2.5,1.5)[0],p(2.5,1.5)[1]+25,p(4,2)[0],p(4,2)[1]+25)
    body += line(*A,*D) + line(*D,*C) + line(*C,*B) + line(*B,*A)
    for point,label,dx,dy in [(A,"A",12,-10),(D,"D",12,-10),(B,"B",12,18),(C,"C",12,18)]:
        body += circle(*point,5,"black") + text(point[0]+dx, point[1]+dy, label,16,"start")
    body += text(120, 465, "y=√(3x), y=√x, 윗변 y=3/2", 17, "start")
    write_svg(folder, name, body)

def five_panels(folder, name):
    body = ""
    for i in range(5):
        x0 = 25 + i*145
        body += '<rect x="%g" y="90" width="125" height="300" fill="white" stroke="black" stroke-width="2"/>' % x0
        body += text(x0+62, 75, str(i+1), 20, weight="bold")
        body += line(x0+18, 345, x0+108, 345, width=1) + line(x0+30, 360, x0+30, 125, width=1)
    # 1 horizontal line; 2 vertical; 3 sideways V; 4 piecewise function; 5 duplicate x
    body += line(50, 250, 125, 250, width=3)
    body += line(190, 335, 190, 145, width=3)
    body += '<path d="M325 170 L365 260 L325 350" fill="none" stroke="black" stroke-width="3"/>'
    body += '<path d="M465 330 L520 180 L570 300" fill="none" stroke="black" stroke-width="3"/>'
    body += circle(645, 230, 6, "black") + circle(645, 300, 6, "black")
    write_svg(folder, name, body, 760, 430)

def composite_png(folder, name):
    im = Image.new("RGB", (1100, 700), "white")
    d = ImageDraw.Draw(im)
    h1, h2 = font(26, True), font(20)
    d.text((35, 25), "두 무리함수 사이의 음영 넓이", fill="black", font=h1)
    ox, oy, sx, sy = 100, 590, 105, 75
    d.line((ox, oy, 980, oy), fill="black", width=3)
    d.line((ox, oy, ox, 90), fill="black", width=3)
    pts1 = []
    pts2 = []
    for i in range(0, 81):
        x = 1 + i*3/80
        y1 = 2*math.sqrt(x)
        y2 = math.sqrt(x)
        pts1.append((ox+x*sx, oy-y1*sy))
        pts2.append((ox+x*sx, oy-y2*sy))
    d.polygon(pts1 + list(reversed(pts2)), fill="#dddddd", outline="black")
    d.line(pts1, fill="black", width=4)
    d.line(pts2, fill="black", width=4)
    # auxiliary line y=2 through the endpoint intersections
    d.line((ox+1*sx, oy-2*sy, ox+4*sx, oy-2*sy), fill="black", width=4)
    for x, y, lab in [(1,2,"A(1,2)"),(4,2,"B(4,2)")]:
        px, py = ox+x*sx, oy-y*sy
        d.ellipse((px-7,py-7,px+7,py+7), fill="black")
        d.text((px+10, py-28), lab, fill="black", font=h2)
    d.text((930, 610), "x", fill="black", font=h2)
    d.text((75, 90), "y", fill="black", font=h2)
    d.text((700, 655), "f(x)=2√x, g(x)=√x, 1≤x≤4", fill="black", font=h2)
    folder.mkdir(parents=True, exist_ok=True)
    im.save(folder / name, "PNG")

def quadratic(folder, name):
    body = axes(100, 420, 700, 70)
    body += '<path d="M180 380 C270 270 350 215 430 210 C510 215 590 270 680 380" fill="none" stroke="black" stroke-width="3"/>'
    body += line(260, 420, 260, 180, dash=True, width=1) + line(530, 420, 530, 180, dash=True, width=1)
    body += line(370, 420, 370, 210, dash=True, width=1)
    body += circle(260, 420, 6, "black") + circle(530, 420, 6, "black") + circle(370, 210, 6, "black")
    body += text(260, 450, "-1", 16) + text(530, 450, "3", 16) + text(385, 205, "V(1,-4)", 16, "start")
    body += text(120, 465, "f(x)=x^2−2x−3", 18, "start")
    write_svg(folder, name, body)

def piecewise(folder, name):
    body = axes(100, 420, 700, 70)
    body += '<path d="M100 420 L370 30 L640 420" fill="none" stroke="black" stroke-width="3"/>'
    body += circle(370, 30, 7, "black") + line(100, 420, 640, 420, dash=True, width=1)
    body += text(385, 52, "(3,6)", 16, "start") + text(620, 450, "6", 16)
    write_svg(folder, name, body)

def main():
    folders = {
      "gmid": OUT / "25_금당고_2학기_중간_고1_유사",
      "mmid": OUT / "25_매산고_2학기_중간_고1_유사",
      "smid": OUT / "25_순천고_2학기_중간_고1_유사",
      "gfinal": OUT / "25_금당고_2학기_기말_고1_유사",
      "sfinal": OUT / "25_순천고_2학기_기말_고1_유사",
      "jfinal": OUT / "25_제일고_2학기_기말_고1_유사",
      "pfinal": OUT / "25_팔마고_2학기_기말_고1_유사",
      "hfinal": OUT / "25_효천고_2학기_기말_고1_유사",
    }
    coordinate_triangle(folders["gmid"], "q14.svg")
    circle_tangent(folders["mmid"], "q10.svg")
    venn(folders["smid"], "q11.svg")
    coordinate_triangle(folders["smid"], "q18.svg", centroid=True)
    mapping(folders["gfinal"], "q06.svg", ["-2","-1","0","1"], ["0","1","2","3"], [("-2","1"),("-1","3"),("0","0"),("1","2")])
    rational_graph(folders["gfinal"], "q16.svg", radical=True, asymptote_x=-1, asymptote_y=2)
    mapping(folders["sfinal"], "q04.svg", ["2","5"], ["5","8"], [("2","5"),("5","8")], "f then g")
    function_identity(folders["sfinal"], "q10.svg", chain=True)
    rational_graph(folders["sfinal"], "q13.svg")
    proof_png(folders["sfinal"], "q16.png")
    mapping(folders["jfinal"], "q10.svg", ["0","1","2"], ["0","1","2"], [("2","0"),("0","1"),("1","2")])
    function_identity(folders["jfinal"], "q12.svg", 8, 7)
    radical_square(folders["jfinal"], "q17.svg")
    five_panels(folders["pfinal"], "q01.svg")
    mapping(folders["pfinal"], "q02.svg", ["2","3"], ["3","4"], [("2","3"),("3","4")], "g then f")
    mapping(folders["pfinal"], "q03.svg", ["2","4"], ["4","5"], [("2","4"),("4","5")], "inverse then g")
    radical_graph(folders["pfinal"], "q05.svg", (4,2), reverse=True)
    radical_left_actual(folders["pfinal"], "q05.svg")
    composite_png(folders["pfinal"], "q18.png")
    quadratic(folders["pfinal"], "q19.svg")
    actual_rational_graph(folders["gfinal"], "q16.svg", "gfinal")
    actual_rational_graph(folders["sfinal"], "q13.svg", "sfinal")
    actual_rational_graph(folders["hfinal"], "q13.svg", "hfinal")
    sampled_graph(folders["gfinal"], "q16.svg", "g_q16")
    sampled_graph(folders["sfinal"], "q13.svg", "s_q13")
    sampled_graph(folders["jfinal"], "q12.svg", "j_q12")
    sampled_graph(folders["jfinal"], "q17.svg", "j_q17")
    sampled_graph(folders["pfinal"], "q19.svg", "p_q19")
    sampled_graph(folders["hfinal"], "q13.svg", "h_q13")
    piecewise(folders["hfinal"], "q17.svg")
    print("rendered 21 plan-locked visual assets")

if __name__ == "__main__":
    main()
