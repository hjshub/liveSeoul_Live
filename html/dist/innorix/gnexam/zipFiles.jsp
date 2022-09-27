<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ page import="com.innorix.transfer.InnorixUpload" %>
<%@ page import="java.io.File" %>
<%@ page import="java.io.FileInputStream" %>
<%@ page import="java.io.FileOutputStream" %>
<%@ page import="java.util.zip.ZipEntry" %>
<%@ page import="java.util.zip.ZipOutputStream" %>
<%@ page import="java.io.PrintWriter" %>
<%@ page import="org.json.JSONObject"%>



<%
String directory = InnorixUpload.getServletAbsolutePath(request);
directory = directory.substring(0, directory.lastIndexOf("/") + 1) + "data";

String strFilePaths = request.getParameter("filePaths");  //ZIP이름 만든거
String strZipFileName = request.getParameter("zipFileName"); //서버에 저장된 파일 경로

System.out.println("========== 압축시작 ==========");
if ("POST".equals(request.getMethod()))
{

	if (strFilePaths != null) {
		String[] arrFilePath = strFilePaths.split(","); //파일경로 배열에 담고

		byte[] buf = new byte[1024]; //buf 사이즈 설정

        ZipOutputStream output = null;
        
        // 압축
        try {
        	//ZIP파일 압축 START
        	output = new ZipOutputStream(new FileOutputStream(directory + "/" + strZipFileName)); // zip 파일 생성 
        	//여기 생성한건 틀?만 생성해둔거
            for (int i=0; i<arrFilePath.length; i++) { //파일 개수만큼 반복
            	
            	FileInputStream in = null;//＊
            	try {
            		File file = new File(arrFilePath[i]);//＊
            		in = new FileInputStream(file); //압축 파일 대상
            		output.putNextEntry(new ZipEntry(file.getName())); //압축 파일에 저장될 파일명
            		int len; 
    	            while ((len = in.read(buf)) > 0) {  // 압축 대상의 파일(data)을 설정된 사이즈(1024)만큼 읽어 들인다.
    	            	//in파일을 buf사이즈 만큼 읽어서 len에 넣어라 이게 0보다크면 zip틀만든거에 넣어라 
    	            	output.write(buf, 0, len); //읽은 파일을 ZipOutPutStream에 Write
    	            }
    	            output.closeEntry();
    	            //zip 파일 압축 END
            	// * 작성해둔거 메모리 부하 가비지컬렉션 주소참조
            	// TRY CATCH 이중으로 쓰는 문제 수정해놓기
            	// 
            	} catch(Exception e) {
            		e.printStackTrace();
            		
            	} finally {
            		if(in != null) {
            			try { in.close(); } catch(Exception e) { }
            		}
            	}
            }        
        } catch(Exception e) {
        	e.printStackTrace();
        } finally {
        	if( output != null ) {
        		try { output.close(); } catch(Exception e) {}
        	}
        }
        
       JSONObject json = new JSONObject();
       File zipFile = new File(directory + "/" + strZipFileName);
       json.put("zipFileName", zipFile.getName());
       json.put("zipFilePath", zipFile.getAbsolutePath());
       json.put("zipFileSize", zipFile.getTotalSpace());
       
       System.out.println("strZipFileName :"+strZipFileName);
       System.out.println("zipFileName :"+zipFile.getName());
       System.out.println("zipFilePath :"+zipFile.getAbsolutePath());
       System.out.println("zipFileSize :"+zipFile.getTotalSpace());
       response.getWriter().print(json); 

	}
}

// CORS 관련 헤더 추가
response.setHeader("Access-Control-Allow-Origin", "*");
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
response.setHeader("Access-Control-Allow-Headers", "Authorization,DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type");
%>