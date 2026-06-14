(function () {
    var _teachers = [];
    var _mode = 'list';
    var _selectedId = '';
    var _loading = false;
    var _saving = false;
    var _error = '';
    var _notice = '';

    function esc(value) {
        return EieApp.escapeHtml(value == null ? '' : value);
    }

    function text(value) {
        return String(value == null ? '' : value).trim();
    }

    function jsArg(value) {
        return JSON.stringify(String(value == null ? '' : value));
    }

    function roleLabel(role) {
        var key = text(role).toLowerCase();
        if (key === 'admin' || key === 'owner') return '원장';
        if (key === 'disabled') return '비활성';
        return '선생님';
    }

    function selectedTeacher() {
        return _teachers.find(function (teacher) {
            return String(teacher.id || '') === String(_selectedId);
        }) || null;
    }

    async function loadTeachers(force) {
        if (_loading) return;
        if (_teachers.length && !force) return;
        _loading = true;
        _error = '';
        try {
            var result = await EieApi.getTeachers();
            _teachers = result.teachers || result.data || [];
        } catch (err) {
            _error = err && err.message ? err.message : '선생님 계정을 불러오지 못했습니다.';
        } finally {
            _loading = false;
        }
    }

    function renderTeacherRows() {
        if (!_teachers.length) return '<div class="eie-empty-box">등록된 선생님 계정이 없습니다.</div>';
        var rows = _teachers.slice().sort(function (a, b) {
            var ar = text(a.role) === 'admin' ? 0 : text(a.role) === 'disabled' ? 2 : 1;
            var br = text(b.role) === 'admin' ? 0 : text(b.role) === 'disabled' ? 2 : 1;
            if (ar !== br) return ar - br;
            return text(a.name).localeCompare(text(b.name), 'ko');
        });
        return '<div class="eie-apms-card" style="padding:0; overflow:hidden;">'
            + rows.map(function (teacher) {
                var id = esc(teacher.id || '');
                var disabled = text(teacher.role) === 'disabled';
                return '<div class="eie-apms-contact-row" style="' + (disabled ? 'opacity:.58;' : '') + '">'
                    + '<div><strong>' + esc(teacher.name || '-') + '</strong><span>ID ' + esc(teacher.login_id || '-') + ' · ' + esc(roleLabel(teacher.role)) + '</span></div>'
                    + '<div class="eie-apms-inline-actions">'
                    + '<button type="button" onclick="EieManagementView.openTeacherPage(' + jsArg(teacher.name || '') + ')">페이지</button>'
                    + '<button type="button" onclick="EieManagementView.startEdit(\'' + id + '\')">수정</button>'
                    + '<button type="button" onclick="EieManagementView.resetPassword(\'' + id + '\')">PW 초기화</button>'
                    + '<button type="button" ' + (disabled ? 'disabled ' : '') + 'onclick="EieManagementView.deleteTeacher(\'' + id + '\')">삭제</button>'
                    + '</div>'
                    + '</div>';
            }).join('')
            + '</div>';
    }

    function renderList() {
        return '<div class="eie-apms-toolbar">'
            + '<button type="button" class="eie-primary-button" onclick="EieManagementView.startCreate()">+ 새 선생님 등록</button>'
            + '<button type="button" class="eie-secondary-button" onclick="EieManagementView.seedDefaultTeachers()">기본 계정 생성</button>'
            + '<button type="button" class="eie-secondary-button" onclick="EieManagementView.refresh()"' + (_loading ? ' disabled' : '') + '>새로고침</button>'
            + '</div>'
            + renderTeacherRows();
    }

    function renderForm() {
        var isEdit = _mode === 'edit';
        var teacher = isEdit ? selectedTeacher() : {};
        var role = text(teacher.role || 'teacher');
        return '<aside class="eie-apms-detail-panel">'
            + '<div class="eie-apms-detail-head">'
            + '<h2>' + (isEdit ? '선생님 계정 수정' : '새 선생님 등록') + '</h2>'
            + '<button type="button" class="eie-icon-button" onclick="EieManagementView.cancelForm()">닫기</button>'
            + '</div>'
            + '<div class="eie-apms-form">'
            + '<label><span>이름 *</span><input id="eie-teacher-name" type="text" value="' + esc(teacher.name || '') + '" autocomplete="off"></label>'
            + '<label><span>로그인 ID *</span><input id="eie-teacher-login" type="text" value="' + esc(teacher.login_id || '') + '" autocomplete="off" ' + (isEdit ? 'disabled' : '') + '></label>'
            + (isEdit ? '' : '<label><span>초기 비밀번호 *</span><input id="eie-teacher-password" type="password" autocomplete="new-password"></label>')
            + '<label><span>역할</span><select id="eie-teacher-role">'
            + '<option value="teacher"' + (role !== 'admin' && role !== 'disabled' ? ' selected' : '') + '>선생님</option>'
            + '<option value="admin"' + (role === 'admin' ? ' selected' : '') + '>원장</option>'
            + '<option value="disabled"' + (role === 'disabled' ? ' selected' : '') + '>비활성</option>'
            + '</select></label>'
            + '<div class="eie-action-row is-wide">'
            + '<button type="button" class="eie-primary-button" onclick="EieManagementView.submitForm()"' + (_saving ? ' disabled' : '') + '>' + (_saving ? '저장 중...' : '저장') + '</button>'
            + '<button type="button" class="eie-secondary-button" onclick="EieManagementView.cancelForm()">취소</button>'
            + '</div>'
            + '</div>'
            + '</aside>';
    }

    async function render() {
        await loadTeachers(false);
        var noticeHtml = _notice ? '<div class="eie-success-box">' + esc(_notice) + '</div>' : '';
        var errorHtml = _error ? '<div class="eie-error-box">' + esc(_error) + '</div>' : '';
        return '<section class="eie-apms-students-screen eie-management-screen" aria-labelledby="eie-management-title">'
            + '<button type="button" class="eie-back-button" data-eie-route="dashboard" aria-label="EIE 홈으로 이동" title="EIE 홈">← EIE 홈</button>'
            + '<div class="eie-apms-page-head">'
            + '<div><h1 id="eie-management-title">관리</h1></div>'
            + '</div>'
            + noticeHtml + errorHtml
            + '<div class="eie-apms-student-layout">'
            + '<div class="eie-apms-list-panel">' + renderList() + '</div>'
            + (_mode === 'create' || _mode === 'edit' ? renderForm() : '<aside class="eie-apms-detail-panel is-empty"><div class="eie-apms-detail-empty-title">선생님 계정을 선택하세요</div><p>왼쪽 목록에서 수정하거나 새 선생님 계정을 등록할 수 있습니다.</p></aside>')
            + '</div>'
            + '</section>';
    }

    window.EieManagementView = {
        render: render,
        refresh: async function () {
            // 새로고침은 캐시를 무시하고 원격에서 다시 받아온다.
            if (window.EieApi && typeof EieApi.clearReadCache === 'function') EieApi.clearReadCache();
            await loadTeachers(true);
            return EieRouter.open('management');
        },
        startCreate: function () {
            _mode = 'create';
            _selectedId = '';
            _notice = '';
            EieRouter.open('management');
        },
        startEdit: function (teacherId) {
            _mode = 'edit';
            _selectedId = text(teacherId);
            _notice = '';
            EieRouter.open('management');
        },
        cancelForm: function () {
            _mode = 'list';
            _selectedId = '';
            EieRouter.open('management');
        },
        openTeacherPage: function (teacherName) {
            if (window.EieTeacherView && typeof EieTeacherView.openTeacher === 'function') {
                EieTeacherView.openTeacher(teacherName);
                return;
            }
            EieRouter.open('teacher');
        },
        seedDefaultTeachers: async function () {
            if (!window.confirm('Carmen, IVY, Lily, Stacy, Zoe, Laura 계정을 만들고 비밀번호를 eie1234로 맞출까요?')) return;
            try {
                await EieApi.seedDefaultTeachers();
                _notice = '기본 선생님 계정을 생성했습니다. 초기 비밀번호는 eie1234입니다.';
                await loadTeachers(true);
            } catch (err) {
                _error = err && err.message ? err.message : '기본 선생님 계정 생성에 실패했습니다.';
            }
            return EieRouter.open('management');
        },
        submitForm: async function () {
            if (_saving) return;
            var name = text(document.getElementById('eie-teacher-name') && document.getElementById('eie-teacher-name').value);
            var loginId = text(document.getElementById('eie-teacher-login') && document.getElementById('eie-teacher-login').value);
            var password = text(document.getElementById('eie-teacher-password') && document.getElementById('eie-teacher-password').value);
            var role = text(document.getElementById('eie-teacher-role') && document.getElementById('eie-teacher-role').value) || 'teacher';
            if (!name || (_mode === 'create' && (!loginId || password.length < 4))) {
                _error = '이름, ID, 4자 이상 비밀번호를 입력하세요.';
                return EieRouter.open('management');
            }
            _saving = true;
            try {
                if (_mode === 'edit') await EieApi.updateTeacher(_selectedId, { name: name, role: role });
                else await EieApi.createTeacher({ name: name, login_id: loginId, password: password, role: role });
                _notice = '선생님 계정을 저장했습니다.';
                _mode = 'list';
                _selectedId = '';
                await loadTeachers(true);
            } catch (err) {
                _error = err && err.message ? err.message : '선생님 계정 저장에 실패했습니다.';
            } finally {
                _saving = false;
            }
            return EieRouter.open('management');
        },
        resetPassword: async function (teacherId) {
            var next = text(window.prompt('새 비밀번호'));
            if (!next) return;
            if (next.length < 4) {
                _error = '비밀번호는 4자 이상이어야 합니다.';
                return EieRouter.open('management');
            }
            try {
                await EieApi.resetTeacherPassword(teacherId, next);
                _notice = '비밀번호를 초기화했습니다.';
            } catch (err) {
                _error = err && err.message ? err.message : '비밀번호 초기화에 실패했습니다.';
            }
            return EieRouter.open('management');
        },
        deleteTeacher: async function (teacherId) {
            if (!window.confirm('선생님 계정을 비활성 처리할까요? 실제 삭제 대신 로그인만 막습니다.')) return;
            try {
                await EieApi.deleteTeacher(teacherId);
                _notice = '선생님 계정을 비활성 처리했습니다.';
                await loadTeachers(true);
            } catch (err) {
                _error = err && err.message ? err.message : '선생님 계정 삭제에 실패했습니다.';
            }
            return EieRouter.open('management');
        }
    };
})();
