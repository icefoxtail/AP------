(function () {
    window.EieImportView = {
        async render() {
            const result = await EieApi.getLatestImport();
            EieState.setLatestImport(result?.latest_import || result?.data || null);
            const fileName = result?.latest_import?.file_name || result?.data?.file_name || '연결된 엑셀 없음';
            return EieApp.renderPanel({
                title: '엑셀 가져오기',
                copy: '다음 라운드에서 최신 영어 엑셀 가져오기를 연결합니다.',
                note: `API stub: ${fileName}`
            });
        }
    };
})();
