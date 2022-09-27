<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../innorix.css">
        <script src="../innorix.js"></script>
        <script>
            var control = new Object();
            innorix.setLanguage('ko');
            var innoJquery = innorix._load("innoJquery");
            
            window.onload = function() {
                // 파일전송 컨트롤 생성
                control = innorix.create({
                    el: '#fileControl', // 컨트롤 출력 HTML 객체 ID
                    transferMode: 'both', // 업로드, 다운로드 혼합사용
                    installUrl: '../install/install.html', // Agent 설치 페이지
                    uploadUrl: './uploadSession.jsp', // 업로드 URL
                    agent: false
                });
               	
                // 로딩 완료
                control.on('loadComplete', function (p) {
                	control.setCookie("JSESSIONID=<%=session.getId()%>"); //Agent모드 시 세션 유지
                });
                
                
                // 업로드 완료 이벤트
                control.on('uploadComplete', function (p) {
                    alert("업로드가 완료 되었습니다.\n다운로드 가능하게 재구성 합니다.");
					console.log(p);
                    var urlBase = location.href.substring(0, location.href.lastIndexOf("/") + 1);
                    var fileArray = new Array();
                    var f = p.files;
                    
                    console.log(p.uniqueId);
                    
                    
                    
                    for (var i = 0; i < f.length; i++ ) {
                    	console.log(f[i].uniqueId);
                        var fileObj = new Object();
                        fileObj.printFileName = f[i].clientFileName;
                        fileObj.fileSize = f[i].fileSize;
                        fileObj.downloadUrl = urlBase + "downloadDeleteSession.jsp?uniqueId=" + f[i].uniqueId + "&fileName=" + f[i].clientFileName;
                        fileObj.serverFilePath = f[i].serverFilePath;
                        fileObj.rootName = f[i].rootName;
                        fileArray.push(fileObj);
          
                    }
                    
                    control.removeAllFiles(); // 리스트 컨트롤에서 파일을 삭제
                    control.presetDownloadFiles(fileArray); // 다운로드 목록을 구성
                    
                });
                
                
            };
            
        </script>
    </head>
    <body>
        <a href="../index.html">&larr; 예제 목록</a><br /><br />

        <div id="fileControl"></div><br/>

        <input type="button" value="파일추가" onclick="control.openFileDialog();"/>
        <input type="button" value="폴더추가" onclick="control.openFolderDialog();"/>
        <input type="button" value="업로드" onclick="control.upload();"/>
        <input type="button" value="선택파일 다운로드" onclick="control.downloadSelectedFiles();"/>
        <input type="button" value="전체 다운로드" onclick="control.download();"/>
    </body>
</html>