<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.innorix.transfer.InnorixUpload" %>
<%-- File import --%>
<%@page import="java.io.File"%>

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
	String _type            = uploader.getParameter("type");            // 커스텀 정의 POST Param 1
	String _part            = uploader.getParameter("part");            // 커스텀 정의 POST Param 2
	String _transferId		= uploader.getParameter("_transferId");		// TransferId
	
	/*	
		업로드 간 메타정보 상 노출되는 서버 경로를 숨기기 위한 방법
		( 업로드 완료 시 클라이언트에 서버에 저장된 파일의 절대 경로가 노출되기 때문에 보안 상 노출이 안 되도록 설정 )
		uploader.setHideServerPathInfo(true);
		- uploader.run() 이전에 설정
		- 해당 설정 시 파일 전송 간 발생되는 통신 구간에서는 서버 경로 정보를 주고 받지 않기 위해
		  InnorixUplaod 클래스를 객체화 할 때 지정해주는 directory 값을 고정으로 업로드하며, setDirectory와 함께 사용할 수 없음
	*/
	
	uploader.setHideServerPathInfo(true); //업로드 서버경로 숨김처리
	String _run_retval = uploader.run();

	// 개별파일 업로드 완료
	if("attachFileCompleted".equals(_action)) {
		
		System.out.println("========== uploader.isUploadDone() " + System.currentTimeMillis() + " ==========");
		System.out.println("_orig_filename \t = " + _orig_filename); 		// 원본 파일명
		System.out.println("_new_filename \t = " + _new_filename); 			// 저장 파일명
		
		/* 업로드 서버 경로 숨김처리 시 저장경로 확인 방법  */
		System.out.println("_filepath \t = " + _filepath);				    // 파일 저장경로 (업로드 서버 경로 숨김처리하여 빈값으로 출력)
		String strDir = uploader.getDirectory(); 							// 서버에 저장되는 폴더경로
		System.out.println("strDir \t = " + strDir);
		String strSrvFilePath = strDir.concat(File.separator).concat(_new_filename);
		System.out.println("strSrvFilePath \t = " + strSrvFilePath);		 //서버에 저장된 파일 위치
	}

}

// CORS 관련 헤더 추가
response.setHeader("Access-Control-Allow-Origin", "*");
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
response.setHeader("Access-Control-Allow-Headers", "Authorization,DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type");
%>