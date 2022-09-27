<a href="../gnIndex.html">&larr; 예제 목록</a><br /><br />

<%
request.setCharacterEncoding("UTF-8");
java.util.Enumeration names = request.getParameterNames();

while (names.hasMoreElements()) {
    String name = (String)names.nextElement();
    String values[] = request.getParameterValues(name);

    if (values != null) {
        for (int i=0; i< values.length; i++) {
            System.out.println ( i + ". " + name + " = " + values[i]);
            out.println ( i + ". " + name + " = " + values[i] + "<br />");
        }
    }
}
%>