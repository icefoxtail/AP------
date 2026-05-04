-- ============================================================
-- AP Math OS 전체 시드 수정본
-- 목적:
-- - 기존 박준성 시드 유지
-- - 정겨운 / 정의한 반명은 선생님별 A/B 체계로 사용
-- - 진도/교재 시드 제외
-- - 학생명은 사진 판독 기준 임시 입고, 추후 수정 가능
-- - 기존에 잘못 입고된 정겨운/정의한 반명과 학생명은 UPDATE로 보정
-- ============================================================

-- ============================================================
-- 1. classes
-- ============================================================

INSERT OR IGNORE INTO classes
(id, name, grade, subject, teacher_name, schedule_days, textbook, is_active, day_group, time_label)
VALUES
-- 기존 박준성 반
('m1_a', '중1A', '중1', '수학', '박준성', '', '', 1, '', ''),
('m1_b', '중1B', '중1', '수학', '박준성', '', '', 1, '', ''),
('m1_c', '중1C', '중1', '수학', '박준성', '', '', 1, '', ''),
('m2_a', '중2A', '중2', '수학', '박준성', '', '', 1, '', ''),
('m2_b', '중2B', '중2', '수학', '박준성', '', '', 1, '', ''),
('m3_a', '중3A', '중3', '수학', '박준성', '', '', 1, '', ''),
('m3_b', '중3B', '중3', '수학', '박준성', '', '', 1, '', ''),

-- 정겨운 월수금
('kj_mwf_p1_m1', '중1A', '중1', '수학', '정겨운', '1,3,5', '', 1, 'mwf', '1교시 4:40~6:10'),
('kj_mwf_p2_m2', '중2A', '중2', '수학', '정겨운', '1,3,5', '', 1, 'mwf', '2교시 6:20~7:50'),
('kj_mwf_p3_m3', '중3A', '중3', '수학', '정겨운', '1,3,5', '', 1, 'mwf', '3교시 7:50~9:20'),

-- 정겨운 화목금
('kj_ttf_p1_m2', '중2B', '중2', '수학', '정겨운', '2,4,5', '', 1, 'ttf', '1교시 4:40~6:10'),
('kj_ttf_p2_m1', '중1B', '중1', '수학', '정겨운', '2,4,5', '', 1, 'ttf', '2교시 6:20~7:50'),
('kj_ttf_p3_m3', '중3B', '중3', '수학', '정겨운', '2,4,5', '', 1, 'ttf', '3교시 7:50~9:20'),

-- 정의한 월수금
('jh_mwf_p1_m2', '중2A', '중2', '수학', '정의한', '1,3,5', '', 1, 'mwf', '1교시 4:40~6:10'),
('jh_mwf_p2_m1', '중1A', '중1', '수학', '정의한', '1,3,5', '', 1, 'mwf', '2교시 6:20~7:50'),
('jh_mwf_p3_m3', '중3A', '중3', '수학', '정의한', '1,3,5', '', 1, 'mwf', '3교시 7:50~9:20'),

-- 정의한 화목금
('jh_ttf_p1_m2', '중2B', '중2', '수학', '정의한', '2,4,5', '', 1, 'ttf', '1교시 4:40~6:10'),
('jh_ttf_p2_m1', '중1B', '중1', '수학', '정의한', '2,4,5', '', 1, 'ttf', '2교시 6:20~7:50'),
('jh_ttf_p3_m3', '중3B', '중3', '수학', '정의한', '2,4,5', '', 1, 'ttf', '3교시 7:50~9:20');

-- 기존에 긴 반명 또는 학년명만으로 이미 들어간 정겨운/정의한 반 보정
UPDATE classes SET name = '중1A', grade = '중1', subject = '수학', teacher_name = '정겨운', schedule_days = '1,3,5', textbook = '', is_active = 1, day_group = 'mwf', time_label = '1교시 4:40~6:10' WHERE id = 'kj_mwf_p1_m1';
UPDATE classes SET name = '중2A', grade = '중2', subject = '수학', teacher_name = '정겨운', schedule_days = '1,3,5', textbook = '', is_active = 1, day_group = 'mwf', time_label = '2교시 6:20~7:50' WHERE id = 'kj_mwf_p2_m2';
UPDATE classes SET name = '중3A', grade = '중3', subject = '수학', teacher_name = '정겨운', schedule_days = '1,3,5', textbook = '', is_active = 1, day_group = 'mwf', time_label = '3교시 7:50~9:20' WHERE id = 'kj_mwf_p3_m3';

UPDATE classes SET name = '중2B', grade = '중2', subject = '수학', teacher_name = '정겨운', schedule_days = '2,4,5', textbook = '', is_active = 1, day_group = 'ttf', time_label = '1교시 4:40~6:10' WHERE id = 'kj_ttf_p1_m2';
UPDATE classes SET name = '중1B', grade = '중1', subject = '수학', teacher_name = '정겨운', schedule_days = '2,4,5', textbook = '', is_active = 1, day_group = 'ttf', time_label = '2교시 6:20~7:50' WHERE id = 'kj_ttf_p2_m1';
UPDATE classes SET name = '중3B', grade = '중3', subject = '수학', teacher_name = '정겨운', schedule_days = '2,4,5', textbook = '', is_active = 1, day_group = 'ttf', time_label = '3교시 7:50~9:20' WHERE id = 'kj_ttf_p3_m3';

UPDATE classes SET name = '중2A', grade = '중2', subject = '수학', teacher_name = '정의한', schedule_days = '1,3,5', textbook = '', is_active = 1, day_group = 'mwf', time_label = '1교시 4:40~6:10' WHERE id = 'jh_mwf_p1_m2';
UPDATE classes SET name = '중1A', grade = '중1', subject = '수학', teacher_name = '정의한', schedule_days = '1,3,5', textbook = '', is_active = 1, day_group = 'mwf', time_label = '2교시 6:20~7:50' WHERE id = 'jh_mwf_p2_m1';
UPDATE classes SET name = '중3A', grade = '중3', subject = '수학', teacher_name = '정의한', schedule_days = '1,3,5', textbook = '', is_active = 1, day_group = 'mwf', time_label = '3교시 7:50~9:20' WHERE id = 'jh_mwf_p3_m3';

UPDATE classes SET name = '중2B', grade = '중2', subject = '수학', teacher_name = '정의한', schedule_days = '2,4,5', textbook = '', is_active = 1, day_group = 'ttf', time_label = '1교시 4:40~6:10' WHERE id = 'jh_ttf_p1_m2';
UPDATE classes SET name = '중1B', grade = '중1', subject = '수학', teacher_name = '정의한', schedule_days = '2,4,5', textbook = '', is_active = 1, day_group = 'ttf', time_label = '2교시 6:20~7:50' WHERE id = 'jh_ttf_p2_m1';
UPDATE classes SET name = '중3B', grade = '중3', subject = '수학', teacher_name = '정의한', schedule_days = '2,4,5', textbook = '', is_active = 1, day_group = 'ttf', time_label = '3교시 7:50~9:20' WHERE id = 'jh_ttf_p3_m3';


-- ============================================================
-- 2. students
-- ============================================================

INSERT OR IGNORE INTO students
(id, name, school_name, grade, status)
VALUES
-- 기존 박준성 학생
('s01', '한세아', '왕운중', '중1', '재원'),
('s02', '홍서령', '왕운중', '중1', '재원'),
('s03', '김수인', '왕운중', '중1', '재원'),
('s04', '김다희', '왕운중', '중1', '재원'),
('s05', '임진후', '왕운중', '중1', '재원'),
('s06', '황시아', '왕운중', '중1', '재원'),
('s07', '남지율', '왕운중', '중1', '재원'),
('s08', '남지우', '왕운중', '중1', '재원'),
('s09', '최윤아', '왕의중', '중1', '재원'),
('s10', '조희태', '왕운중', '중1', '재원'),
('s11', '임주현', '왕운중', '중1', '재원'),
('s12', '백주흔', '왕운중', '중2', '재원'),
('s13', '김도현', '왕운중', '중2', '재원'),
('s14', '임현성', '왕운중', '중2', '재원'),
('s15', '박현종', '왕의중', '중2', '재원'),
('s16', '왕유준', '왕운중', '중2', '재원'),
('s17', '강형우', '동산중', '중2', '재원'),
('s18', '이시온', '왕운중', '중3', '재원'),
('s19', '이상원', '삼산중', '중3', '재원'),
('s20', '조예령', '왕운중', '중3', '재원'),
('s21', '유채민', '왕운중', '중3', '재원'),
('s22', '서유나', '왕운중', '중3', '재원'),
('s23', '박정원', '매산중', '중3', '재원'),
('s24', '이시윤', '왕운중', '중3', '재원'),
('s25', '강현욱', '왕운중', '중3', '재원'),
('s26', '남지혁', '왕운중', '중3', '재원'),
('s27', '유예준', '왕운중', '중3', '재원'),
('s28', '김지융', '왕운중', '중3', '재원'),
('s29', '박현성', '왕운중', '중3', '재원'),

-- 정겨운 월수금 1교시 중1
('seed_kj_mwf_p1_01', '임재은', '', '중1', '재원'),
('seed_kj_mwf_p1_02', '황재율', '', '중1', '재원'),
('seed_kj_mwf_p1_03', '배연아', '', '중1', '재원'),
('seed_kj_mwf_p1_04', '임지후', '', '중1', '재원'),
('seed_kj_mwf_p1_05', '정지호', '', '중1', '재원'),

-- 정겨운 월수금 2교시 중2
('seed_kj_mwf_p2_01', '이주하', '', '중2', '재원'),
('seed_kj_mwf_p2_02', '이도경', '', '중2', '재원'),
('seed_kj_mwf_p2_03', '김나은', '', '중2', '재원'),
('seed_kj_mwf_p2_04', '임제이', '', '중2', '재원'),

-- 정겨운 월수금 3교시 중3
('seed_kj_mwf_p3_01', '최강효', '', '중3', '재원'),
('seed_kj_mwf_p3_02', '배연우', '', '중3', '재원'),
('seed_kj_mwf_p3_03', '이율호', '', '중3', '재원'),
('seed_kj_mwf_p3_04', '윤금서', '', '중3', '재원'),
('seed_kj_mwf_p3_05', '윤건', '', '중3', '재원'),

-- 정겨운 화목금 1교시 중2
('seed_kj_ttf_p1_01', '윤채이', '', '중2', '재원'),
('seed_kj_ttf_p1_02', '김윤서', '', '중2', '재원'),
('seed_kj_ttf_p1_03', '서다희', '', '중2', '재원'),
('seed_kj_ttf_p1_04', '김다현', '', '중2', '재원'),
('seed_kj_ttf_p1_05', '김예준', '', '중2', '재원'),

-- 정겨운 화목금 2교시 중1
('seed_kj_ttf_p2_01', '지예서', '', '중1', '재원'),
('seed_kj_ttf_p2_02', '신윤재', '', '중1', '재원'),
('seed_kj_ttf_p2_03', '이채원', '', '중1', '재원'),
('seed_kj_ttf_p2_04', '김수연', '', '중1', '재원'),
('seed_kj_ttf_p2_05', '이신한', '', '중1', '재원'),
('seed_kj_ttf_p2_06', '정다경', '', '중1', '재원'),

-- 정겨운 화목금 3교시 중3
('seed_kj_ttf_p3_01', '임아인', '', '중3', '재원'),
('seed_kj_ttf_p3_02', '홍담희', '', '중3', '재원'),
('seed_kj_ttf_p3_03', '구준영', '', '중3', '재원'),
('seed_kj_ttf_p3_04', '황열음', '', '중3', '재원'),
('seed_kj_ttf_p3_05', '황여준', '', '중3', '재원'),

-- 정의한 월수금 1교시 중2
('seed_jh_mwf_p1_01', '박시윤', '', '중2', '재원'),
('seed_jh_mwf_p1_02', '김범진', '', '중2', '재원'),
('seed_jh_mwf_p1_03', '이예슬', '', '중2', '재원'),

-- 정의한 월수금 2교시 중1
('seed_jh_mwf_p2_01', '이소윤', '', '중1', '재원'),
('seed_jh_mwf_p2_02', '이예나', '', '중1', '재원'),
('seed_jh_mwf_p2_03', '정준서', '', '중1', '재원'),
('seed_jh_mwf_p2_04', '김동률', '', '중1', '재원'),
('seed_jh_mwf_p2_05', '유다영', '', '중1', '재원'),

-- 정의한 월수금 3교시 중3
('seed_jh_mwf_p3_01', '문소은', '', '중3', '재원'),
('seed_jh_mwf_p3_02', '김서연', '', '중3', '재원'),
('seed_jh_mwf_p3_03', '박수형', '', '중3', '재원'),
('seed_jh_mwf_p3_04', '최은완', '', '중3', '재원'),
('seed_jh_mwf_p3_05', '서다민', '', '중3', '재원'),

-- 정의한 화목금 1교시 중2
('seed_jh_ttf_p1_01', '최재이', '', '중2', '재원'),
('seed_jh_ttf_p1_02', '김리아', '', '중2', '재원'),
('seed_jh_ttf_p1_03', '김리우', '', '중2', '재원'),
('seed_jh_ttf_p1_04', '김윤지', '', '중2', '재원'),
('seed_jh_ttf_p1_05', '정소이', '', '중2', '재원'),
('seed_jh_ttf_p1_06', '박서아', '', '중2', '재원'),
('seed_jh_ttf_p1_07', '박하민', '', '중2', '재원'),

-- 정의한 화목금 2교시 중1
('seed_jh_ttf_p2_01', '김민채', '', '중1', '재원'),
('seed_jh_ttf_p2_02', '이우경', '', '중1', '재원'),
('seed_jh_ttf_p2_03', '김민준', '', '중1', '재원'),
('seed_jh_ttf_p2_04', '박지혁', '', '중1', '재원'),
('seed_jh_ttf_p2_05', '양시우', '', '중1', '재원'),

-- 정의한 화목금 3교시 중3
('seed_jh_ttf_p3_01', '김지안', '', '중3', '재원'),
('seed_jh_ttf_p3_02', '이승기', '', '중3', '재원'),
('seed_jh_ttf_p3_03', '권도윤', '', '중3', '재원'),
('seed_jh_ttf_p3_04', '김의정', '', '중3', '재원'),
('seed_jh_ttf_p3_05', '박규민', '', '중3', '재원');

-- 기존에 잘못 판독된 이름으로 이미 들어간 정겨운/정의한 학생명 보정
UPDATE students SET name = '임재은', school_name = '', grade = '중1', status = '재원' WHERE id = 'seed_kj_mwf_p1_01';
UPDATE students SET name = '황재율', school_name = '', grade = '중1', status = '재원' WHERE id = 'seed_kj_mwf_p1_02';
UPDATE students SET name = '배연아', school_name = '', grade = '중1', status = '재원' WHERE id = 'seed_kj_mwf_p1_03';
UPDATE students SET name = '임지후', school_name = '', grade = '중1', status = '재원' WHERE id = 'seed_kj_mwf_p1_04';
UPDATE students SET name = '정지호', school_name = '', grade = '중1', status = '재원' WHERE id = 'seed_kj_mwf_p1_05';

UPDATE students SET name = '이주하', school_name = '', grade = '중2', status = '재원' WHERE id = 'seed_kj_mwf_p2_01';
UPDATE students SET name = '이도경', school_name = '', grade = '중2', status = '재원' WHERE id = 'seed_kj_mwf_p2_02';
UPDATE students SET name = '김나은', school_name = '', grade = '중2', status = '재원' WHERE id = 'seed_kj_mwf_p2_03';
UPDATE students SET name = '임제이', school_name = '', grade = '중2', status = '재원' WHERE id = 'seed_kj_mwf_p2_04';

UPDATE students SET name = '최강효', school_name = '', grade = '중3', status = '재원' WHERE id = 'seed_kj_mwf_p3_01';
UPDATE students SET name = '배연우', school_name = '', grade = '중3', status = '재원' WHERE id = 'seed_kj_mwf_p3_02';
UPDATE students SET name = '이율호', school_name = '', grade = '중3', status = '재원' WHERE id = 'seed_kj_mwf_p3_03';
UPDATE students SET name = '윤금서', school_name = '', grade = '중3', status = '재원' WHERE id = 'seed_kj_mwf_p3_04';
UPDATE students SET name = '윤건', school_name = '', grade = '중3', status = '재원' WHERE id = 'seed_kj_mwf_p3_05';

UPDATE students SET name = '윤채이', school_name = '', grade = '중2', status = '재원' WHERE id = 'seed_kj_ttf_p1_01';
UPDATE students SET name = '김윤서', school_name = '', grade = '중2', status = '재원' WHERE id = 'seed_kj_ttf_p1_02';
UPDATE students SET name = '서다희', school_name = '', grade = '중2', status = '재원' WHERE id = 'seed_kj_ttf_p1_03';
UPDATE students SET name = '김다현', school_name = '', grade = '중2', status = '재원' WHERE id = 'seed_kj_ttf_p1_04';
UPDATE students SET name = '김예준', school_name = '', grade = '중2', status = '재원' WHERE id = 'seed_kj_ttf_p1_05';

UPDATE students SET name = '지예서', school_name = '', grade = '중1', status = '재원' WHERE id = 'seed_kj_ttf_p2_01';
UPDATE students SET name = '신윤재', school_name = '', grade = '중1', status = '재원' WHERE id = 'seed_kj_ttf_p2_02';
UPDATE students SET name = '이채원', school_name = '', grade = '중1', status = '재원' WHERE id = 'seed_kj_ttf_p2_03';
UPDATE students SET name = '김수연', school_name = '', grade = '중1', status = '재원' WHERE id = 'seed_kj_ttf_p2_04';
UPDATE students SET name = '이신한', school_name = '', grade = '중1', status = '재원' WHERE id = 'seed_kj_ttf_p2_05';
UPDATE students SET name = '정다경', school_name = '', grade = '중1', status = '재원' WHERE id = 'seed_kj_ttf_p2_06';

UPDATE students SET name = '임아인', school_name = '', grade = '중3', status = '재원' WHERE id = 'seed_kj_ttf_p3_01';
UPDATE students SET name = '홍담희', school_name = '', grade = '중3', status = '재원' WHERE id = 'seed_kj_ttf_p3_02';
UPDATE students SET name = '구준영', school_name = '', grade = '중3', status = '재원' WHERE id = 'seed_kj_ttf_p3_03';
UPDATE students SET name = '황열음', school_name = '', grade = '중3', status = '재원' WHERE id = 'seed_kj_ttf_p3_04';
UPDATE students SET name = '황여준', school_name = '', grade = '중3', status = '재원' WHERE id = 'seed_kj_ttf_p3_05';

UPDATE students SET name = '박시윤', school_name = '', grade = '중2', status = '재원' WHERE id = 'seed_jh_mwf_p1_01';
UPDATE students SET name = '김범진', school_name = '', grade = '중2', status = '재원' WHERE id = 'seed_jh_mwf_p1_02';
UPDATE students SET name = '이예슬', school_name = '', grade = '중2', status = '재원' WHERE id = 'seed_jh_mwf_p1_03';

UPDATE students SET name = '이소윤', school_name = '', grade = '중1', status = '재원' WHERE id = 'seed_jh_mwf_p2_01';
UPDATE students SET name = '이예나', school_name = '', grade = '중1', status = '재원' WHERE id = 'seed_jh_mwf_p2_02';
UPDATE students SET name = '정준서', school_name = '', grade = '중1', status = '재원' WHERE id = 'seed_jh_mwf_p2_03';
UPDATE students SET name = '김동률', school_name = '', grade = '중1', status = '재원' WHERE id = 'seed_jh_mwf_p2_04';
UPDATE students SET name = '유다영', school_name = '', grade = '중1', status = '재원' WHERE id = 'seed_jh_mwf_p2_05';

UPDATE students SET name = '문소은', school_name = '', grade = '중3', status = '재원' WHERE id = 'seed_jh_mwf_p3_01';
UPDATE students SET name = '김서연', school_name = '', grade = '중3', status = '재원' WHERE id = 'seed_jh_mwf_p3_02';
UPDATE students SET name = '박수형', school_name = '', grade = '중3', status = '재원' WHERE id = 'seed_jh_mwf_p3_03';
UPDATE students SET name = '최은완', school_name = '', grade = '중3', status = '재원' WHERE id = 'seed_jh_mwf_p3_04';
UPDATE students SET name = '서다민', school_name = '', grade = '중3', status = '재원' WHERE id = 'seed_jh_mwf_p3_05';

UPDATE students SET name = '최재이', school_name = '', grade = '중2', status = '재원' WHERE id = 'seed_jh_ttf_p1_01';
UPDATE students SET name = '김리아', school_name = '', grade = '중2', status = '재원' WHERE id = 'seed_jh_ttf_p1_02';
UPDATE students SET name = '김리우', school_name = '', grade = '중2', status = '재원' WHERE id = 'seed_jh_ttf_p1_03';
UPDATE students SET name = '김윤지', school_name = '', grade = '중2', status = '재원' WHERE id = 'seed_jh_ttf_p1_04';
UPDATE students SET name = '정소이', school_name = '', grade = '중2', status = '재원' WHERE id = 'seed_jh_ttf_p1_05';
UPDATE students SET name = '박서아', school_name = '', grade = '중2', status = '재원' WHERE id = 'seed_jh_ttf_p1_06';
UPDATE students SET name = '박하민', school_name = '', grade = '중2', status = '재원' WHERE id = 'seed_jh_ttf_p1_07';

UPDATE students SET name = '김민채', school_name = '', grade = '중1', status = '재원' WHERE id = 'seed_jh_ttf_p2_01';
UPDATE students SET name = '이우경', school_name = '', grade = '중1', status = '재원' WHERE id = 'seed_jh_ttf_p2_02';
UPDATE students SET name = '김민준', school_name = '', grade = '중1', status = '재원' WHERE id = 'seed_jh_ttf_p2_03';
UPDATE students SET name = '박지혁', school_name = '', grade = '중1', status = '재원' WHERE id = 'seed_jh_ttf_p2_04';
UPDATE students SET name = '양시우', school_name = '', grade = '중1', status = '재원' WHERE id = 'seed_jh_ttf_p2_05';

UPDATE students SET name = '김지안', school_name = '', grade = '중3', status = '재원' WHERE id = 'seed_jh_ttf_p3_01';
UPDATE students SET name = '이승기', school_name = '', grade = '중3', status = '재원' WHERE id = 'seed_jh_ttf_p3_02';
UPDATE students SET name = '권도윤', school_name = '', grade = '중3', status = '재원' WHERE id = 'seed_jh_ttf_p3_03';
UPDATE students SET name = '김의정', school_name = '', grade = '중3', status = '재원' WHERE id = 'seed_jh_ttf_p3_04';
UPDATE students SET name = '박규민', school_name = '', grade = '중3', status = '재원' WHERE id = 'seed_jh_ttf_p3_05';


-- ============================================================
-- 3. class_students
-- ============================================================

INSERT OR IGNORE INTO class_students
(class_id, student_id)
VALUES
-- 기존 박준성 매핑
('m1_a', 's01'),
('m1_a', 's02'),
('m1_a', 's03'),
('m1_a', 's04'),
('m1_a', 's05'),
('m1_b', 's06'),
('m1_b', 's07'),
('m1_b', 's08'),
('m1_b', 's09'),
('m1_c', 's10'),
('m1_c', 's11'),
('m2_a', 's12'),
('m2_a', 's13'),
('m2_a', 's14'),
('m2_a', 's15'),
('m2_a', 's16'),
('m2_a', 's17'),
('m3_a', 's18'),
('m3_a', 's19'),
('m3_a', 's20'),
('m3_a', 's21'),
('m3_a', 's22'),
('m3_b', 's23'),
('m3_b', 's24'),
('m3_b', 's25'),
('m3_b', 's26'),
('m3_b', 's27'),
('m3_b', 's28'),
('m3_b', 's29'),

-- 정겨운 월수금 1교시 중1A
('kj_mwf_p1_m1', 'seed_kj_mwf_p1_01'),
('kj_mwf_p1_m1', 'seed_kj_mwf_p1_02'),
('kj_mwf_p1_m1', 'seed_kj_mwf_p1_03'),
('kj_mwf_p1_m1', 'seed_kj_mwf_p1_04'),
('kj_mwf_p1_m1', 'seed_kj_mwf_p1_05'),

-- 정겨운 월수금 2교시 중2A
('kj_mwf_p2_m2', 'seed_kj_mwf_p2_01'),
('kj_mwf_p2_m2', 'seed_kj_mwf_p2_02'),
('kj_mwf_p2_m2', 'seed_kj_mwf_p2_03'),
('kj_mwf_p2_m2', 'seed_kj_mwf_p2_04'),

-- 정겨운 월수금 3교시 중3A
('kj_mwf_p3_m3', 'seed_kj_mwf_p3_01'),
('kj_mwf_p3_m3', 'seed_kj_mwf_p3_02'),
('kj_mwf_p3_m3', 'seed_kj_mwf_p3_03'),
('kj_mwf_p3_m3', 'seed_kj_mwf_p3_04'),
('kj_mwf_p3_m3', 'seed_kj_mwf_p3_05'),

-- 정겨운 화목금 1교시 중2B
('kj_ttf_p1_m2', 'seed_kj_ttf_p1_01'),
('kj_ttf_p1_m2', 'seed_kj_ttf_p1_02'),
('kj_ttf_p1_m2', 'seed_kj_ttf_p1_03'),
('kj_ttf_p1_m2', 'seed_kj_ttf_p1_04'),
('kj_ttf_p1_m2', 'seed_kj_ttf_p1_05'),

-- 정겨운 화목금 2교시 중1B
('kj_ttf_p2_m1', 'seed_kj_ttf_p2_01'),
('kj_ttf_p2_m1', 'seed_kj_ttf_p2_02'),
('kj_ttf_p2_m1', 'seed_kj_ttf_p2_03'),
('kj_ttf_p2_m1', 'seed_kj_ttf_p2_04'),
('kj_ttf_p2_m1', 'seed_kj_ttf_p2_05'),
('kj_ttf_p2_m1', 'seed_kj_ttf_p2_06'),

-- 정겨운 화목금 3교시 중3B
('kj_ttf_p3_m3', 'seed_kj_ttf_p3_01'),
('kj_ttf_p3_m3', 'seed_kj_ttf_p3_02'),
('kj_ttf_p3_m3', 'seed_kj_ttf_p3_03'),
('kj_ttf_p3_m3', 'seed_kj_ttf_p3_04'),
('kj_ttf_p3_m3', 'seed_kj_ttf_p3_05'),

-- 정의한 월수금 1교시 중2A
('jh_mwf_p1_m2', 'seed_jh_mwf_p1_01'),
('jh_mwf_p1_m2', 'seed_jh_mwf_p1_02'),
('jh_mwf_p1_m2', 'seed_jh_mwf_p1_03'),

-- 정의한 월수금 2교시 중1A
('jh_mwf_p2_m1', 'seed_jh_mwf_p2_01'),
('jh_mwf_p2_m1', 'seed_jh_mwf_p2_02'),
('jh_mwf_p2_m1', 'seed_jh_mwf_p2_03'),
('jh_mwf_p2_m1', 'seed_jh_mwf_p2_04'),
('jh_mwf_p2_m1', 'seed_jh_mwf_p2_05'),

-- 정의한 월수금 3교시 중3A
('jh_mwf_p3_m3', 'seed_jh_mwf_p3_01'),
('jh_mwf_p3_m3', 'seed_jh_mwf_p3_02'),
('jh_mwf_p3_m3', 'seed_jh_mwf_p3_03'),
('jh_mwf_p3_m3', 'seed_jh_mwf_p3_04'),
('jh_mwf_p3_m3', 'seed_jh_mwf_p3_05'),

-- 정의한 화목금 1교시 중2B
('jh_ttf_p1_m2', 'seed_jh_ttf_p1_01'),
('jh_ttf_p1_m2', 'seed_jh_ttf_p1_02'),
('jh_ttf_p1_m2', 'seed_jh_ttf_p1_03'),
('jh_ttf_p1_m2', 'seed_jh_ttf_p1_04'),
('jh_ttf_p1_m2', 'seed_jh_ttf_p1_05'),
('jh_ttf_p1_m2', 'seed_jh_ttf_p1_06'),
('jh_ttf_p1_m2', 'seed_jh_ttf_p1_07'),

-- 정의한 화목금 2교시 중1B
('jh_ttf_p2_m1', 'seed_jh_ttf_p2_01'),
('jh_ttf_p2_m1', 'seed_jh_ttf_p2_02'),
('jh_ttf_p2_m1', 'seed_jh_ttf_p2_03'),
('jh_ttf_p2_m1', 'seed_jh_ttf_p2_04'),
('jh_ttf_p2_m1', 'seed_jh_ttf_p2_05'),

-- 정의한 화목금 3교시 중3B
('jh_ttf_p3_m3', 'seed_jh_ttf_p3_01'),
('jh_ttf_p3_m3', 'seed_jh_ttf_p3_02'),
('jh_ttf_p3_m3', 'seed_jh_ttf_p3_03'),
('jh_ttf_p3_m3', 'seed_jh_ttf_p3_04'),
('jh_ttf_p3_m3', 'seed_jh_ttf_p3_05');