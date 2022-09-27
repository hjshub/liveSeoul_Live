<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.innorix.transfer.InnorixUpload" %>
<%@page import="java.io.File" %>
<%
request.setCharacterEncoding("UTF-8");
String[] strDeletedID = request.getParameterValues("_innorix_deleted_id"); // 삭제된 파일ID
String[] strDeletedName = request.getParameterValues("_innorix_deleted_name"); // 삭제된 파일이름
String[] strDeletedSize = request.getParameterValues("_innorix_deleted_size"); // 삭제된 파일용량
for(int i=0; i<strDeletedID.length; i++){
	System.out.println("삭제된 "+i+"번째 id= "+strDeletedID[i]);
	System.out.println("삭제된 "+i+"번째 name= "+strDeletedName[i]);
	System.out.println("삭제된 "+i+"번째 size= "+strDeletedSize[i]);
	
	out.println("삭제된 " + i + "번째 id= " + strDeletedID[i] + "<br />");
	out.println("삭제된 " + i + "번째 name= " + strDeletedName[i] + "<br />");
	out.println("삭제된 " + i + "번째 size= " + strDeletedSize[i] + "<br />");
}
%>
<a href="../gnIndex.html">&larr; 예제 목록</a><br /><br />