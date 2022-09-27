<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.innorix.transfer.InnorixUpload" %>

<%
// CORS체크를 위한 OPTIONS 메소드가 들어오므로 POST 일 경우에만 동작하도록 조건 추가
if ("POST".equals(request.getMethod()))
{
	String directory = InnorixUpload.getServletAbsolutePath(request);
	directory = directory.substring(0, directory.lastIndexOf("/") + 1) + "data"; 
	int maxPostSize = 2147482624; // bytes

	InnorixUpload uploader = new InnorixUpload(request, response, maxPostSize, directory);

	/*
		전달되는 _action Param 정보
			speedCheck          : 전송속도 측정
			getServerInfo       : 서버정보 확인
			getFileInfo         : 파일정보 확인
			attachFile          : 파일전송 진행
			attachFileCompleted : 파일전송 완료
	*/

	String _action          = uploader.getParameter("_action");         // 동작 플래그
	String _orig_filename   = uploader.getParameter("_orig_filename");  // 원본 파일명
	String _new_filename    = uploader.getParameter("_new_filename");   // 저장 파일명
	String _filesize        = uploader.getParameter("_filesize");       // 파일 사이즈
	String _start_offset    = uploader.getParameter("_start_offset");   // 파일저장 시작지점
	String _end_offset      = uploader.getParameter("_end_offset");     // 파일저장 종료지점
	String _filepath        = uploader.getParameter("_filepath");       // 파일 저장경로
	String _el              = uploader.getParameter("el");              // 컨트롤 엘리먼트 ID
	
	String fileParam1       = uploader.getParameter("fileParam1");        // 파일 별 커스텀 정의 POST Param 1
	String fileParam2   	= uploader.getParameter("fileParam2");	// 파일 별 커스텀 정의 POST Param 2
	String transParam1      = uploader.getParameter("transParam1");				// 전송 별 커스텀 정의 POST Param 3
	String transParam2      = uploader.getParameter("transParam2");				// 전송 별 커스텀 정의 POST Param 4
	
	String _run_retval = uploader.run();
	
	// 개별파일 업로드 완료
	if("attachFileCompleted".equals(_action)) {
		System.out.println("========== innorix transfer " + System.currentTimeMillis() + " ==========");
		System.out.println("_action \t = " + _action);
		System.out.println("트랜잭션별  transParam1 : " + transParam1 + ", transParam2 : " + transParam2);
		System.out.println("파일별  fileParam1 : " + fileParam1 + ", fileParam2 : " + fileParam2);
	}

	
	
}

// CORS 관련 헤더 추가
response.setHeader("Access-Control-Allow-Origin", "*");
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
response.setHeader("Access-Control-Allow-Headers", "Authorization,DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type");
%>