<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.innorix.transfer.InnorixDownload" %>
<%@ page import="java.io.*" %>

<%
String saveDir = delimiterReplace(request.getRealPath(request.getServletPath()));
String filePath = saveDir.substring(0, saveDir.lastIndexOf("/") + 1);

/*
    filePath
        파일이 저장된 스토리지 전체경로
        디렉토리 구분은 윈도우, 유닉스 모두 "/" 문자 사용
        윈도우 - C:/storage/path1/path2/data
        유닉스 - /storage/path1/path2/data
*/

// downloadType : "stream" 설정시 자동 전달되는 GET Param 값
String szStartOffset = request.getParameter("_StartOffset");
String szEndOffset = request.getParameter("_EndOffset");

// 파일 스트림 데이터 참조용 GET Param 값, 파라메터 명은 자유 형식
String fileID = request.getParameter("fileID");
String fileName = request.getParameter("fileName");
String sysFileName = new String();
String orgFileName = new String();

if (fileID != null) {
    if (fileID.equals("1")) {
        sysFileName = "sample-file.pdf"; // 시스템 저장 파일명
        orgFileName = "INNORIX WP 브로셔.pdf"; // 원본 파일명
    }

    if (fileID.equals("2")) {
        sysFileName = "sample-file.pdf";
        orgFileName = "INNORIX WP Brochure.pdf";
    }

    if (fileID.equals("3")) {
        sysFileName = "sample-file.pdf";
        orgFileName = "INNORIX WP パンフレット.pdf";
    }
}

if (fileName != null) {
    sysFileName = "data/" + fileName;
    orgFileName = "data/" + fileName;
}

// 파일명 깨짐대응 문자열 인코딩 처리
orgFileName = java.net.URLEncoder.encode(orgFileName, "UTF-8").replaceAll("\\+", "%20");

File file = new File(filePath + sysFileName);

response.setContentType("application/octet-stream");
response.setHeader("Accept-Ranges", "bytes");
response.setHeader("Content-Disposition", "attachment; filename=\"" + orgFileName +"\"");

long startOffset = 0;
long endOffset = 0;

if (szStartOffset != null) {
    startOffset = Long.parseLong(szStartOffset);
}

if (szEndOffset != null) {
    endOffset = Long.parseLong(szEndOffset);
}

long contentLength = 0;

if(szStartOffset != null || szEndOffset != null) { // 컨트롤 다운로드 요청시
    contentLength = endOffset - startOffset + 1;
} else { // html 일반 다운로드 요청시
    contentLength = file.length();
}

response.setHeader("Content-Length", "" + contentLength);

byte b[] = new byte[8192];
BufferedInputStream input = null;
BufferedOutputStream output = null;

try {
    input = new BufferedInputStream(new FileInputStream(file));
    output = new BufferedOutputStream(response.getOutputStream());

    int read = 0;

    if (startOffset != 0) {
        long n = input.skip(startOffset);
        if (n == -1) read = -1;
    }

    if(contentLength > 0) {
        while (contentLength > 0) {
            if(contentLength < 8192) {
                b = new byte[(int)contentLength];
            }

            read = input.read(b);

            if(read == -1) {
                break;
            }

            output.write(b, 0, read);
            contentLength = contentLength - read;
        }
    }

    System.out.println("========== innorix transfer " + System.currentTimeMillis() + " ==========");
    System.out.println("fileID  \t: " + fileID);
    System.out.println("sysFilePath \t: " + filePath + sysFileName);
    System.out.println("orgFileName \t: " + java.net.URLDecoder.decode(orgFileName, "UTF-8"));
    System.out.println("totalLength \t: " + file.length() );
    System.out.println("startOffset \t: " + startOffset);
    System.out.println("endOffset \t: " + endOffset);
} catch(Exception e) {
    e.printStackTrace();
} finally {
    if(output != null) {
        output.flush();
        output.close();
    }

    if(input != null) {
        input.close();
    }
}
%>

<%!
private String delimiterReplace(String fullDir)
{
    String ret1 = fullDir.replaceAll("\\\\+", "/");
    String ret2 = ret1.replaceAll("\\/+", "/");

    return ret2;
}
%>