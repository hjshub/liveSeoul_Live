<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.innorix.transfer.InnorixUpload" %>
<%@ page import="com.innorix.transfer.InnorixCustomError" %>
<%@ page import="java.util.UUID" %>

<%
// CORS체크를 위한 OPTIONS 메소드가 들어오므로 POST 일 경우에만 동작하도록 조건 추가
if ("POST".equals(request.getMethod()))
{
	try{
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
	
	String _run_retval = uploader.run();
	
	/*
		getFileInfo 이후 에러발생부터 uploadError이벤트 파라미터에 파일별로 에러메시지가 출력됨
		커스텀 에러 사용 시 getFileInfo를 사용 권장 
	*/
	if("getFileInfo".equals(_action)){
		// ※※ 임의의 에러 발생 ※※
		if("test".equals("test")){
			throw new Exception();	
		}		
	}
	
	} catch(Exception e){
		/*
			
			커스텀 에러 구성
			InnorixCustomError (※ Agent 모드 전용 옵션)
			InnorixCustomError.set(Error Code, Error Message, Error Title, retry);
			InnorixCustomError.run();
			
			- Error Code : 1100번대 번호로 사용 권장 (1100번대 이하는 내부적으로 사용하는 코드로 충돌날 수 있음)
		*/
		InnorixCustomError customError = new InnorixCustomError(response);
		customError.set("1234", "Test Error Tit", "Test Error Content", false); //에러코드, 에러제목, 에러내용, 재전송여부
		customError.run();
				
		e.printStackTrace();
	}
}

	

// CORS 관련 헤더 추가
response.setHeader("Access-Control-Allow-Origin", "*");
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
response.setHeader("Access-Control-Allow-Headers", "Authorization,DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type");
%>