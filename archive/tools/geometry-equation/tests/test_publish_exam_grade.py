"""publish-exam.py reads the grade from the exam name: between underscores (_고2_) or at the end of the name (…_고2)."""
import importlib.util
import sys
import unittest
from pathlib import Path

SVM1=Path(__file__).resolve().parents[1]/'ops'/'svg-m1'
sys.path.insert(0,str(SVM1))
spec=importlib.util.spec_from_file_location('publish_exam_under_test',SVM1/'publish-exam.py')
module=importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class GradeOf(unittest.TestCase):
    def test_grade_between_underscores_or_at_the_end(self):
        self.assertEqual(module.grade_of('19_금당고_2학기_기말_고2_수학II'),'고2')
        self.assertEqual(module.grade_of('비상_기하_벡터_대단원학습평가_고2'),'고2')
        self.assertEqual(module.grade_of('미래엔_수학_다항식_중단원_중3'),'중3')
        self.assertEqual(module.grade_of('고1_공통수학'),'고1')
    def test_no_grade_and_look_alikes_are_unknown(self):
        for name in ('금당고_2학기_기말','abc고2','고22_시험','비상_기하_벡터','고4_시험',''):
            self.assertIsNone(module.grade_of(name),name)
if __name__=='__main__':unittest.main()
