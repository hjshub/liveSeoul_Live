<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.innorix.transfer.InnorixUpload" %>
<%@ page import="java.util.UUID" %>

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
	
	
	// 파일정보 확인
	if("getFileInfo".equals(_action)) {
		/*
			업로드 시 서버에 저장되는 파일 명 변경 (해당 예제는 랜덥값으로 서버에 저장되는 파일명을 설정)
			- uploader.setFileName(파일명+확장자);
			- 확장자 변경 시 파일은 열리지 않게 됩니다.
			- upload.run()전에 위치
		*/
		String saveNm = UUID.randomUUID()+".jpg";
		uploader.setFileName(saveNm);	
	}
	
	String _run_retval = uploader.run();

	// 개별파일 업로드 완료
	if("attachFileCompleted".equals(_action)) {
		/*
		System.out.println("========== uploader.isUploadDone() " + System.currentTimeMillis() + " ==========");
		System.out.println("_orig_filename \t = " + _orig_filename);
		System.out.println("_new_filename \t = " + _new_filename);
		System.out.println("_filesize \t = " + _filesize);
		System.out.println("_filepath \t = " + _filepath);
		*/
	}
	
}

// CORS 관련 헤더 추가
response.setHeader("Access-Control-Allow-Origin", "*");
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
response.setHeader("Access-Control-Allow-Headers", "Authorization,DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type");
%>