<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script type="text/JavaScript" src="/js/jquery-1.8.3.min.js"></script>
<script language="javascript">
function getAddr(){
	// AJAX 주소 검색 요청
	$.ajax({
		url:"http://www.juso.go.kr/addrlink/addrLinkApiJsonp.do"	// 주소검색 OPEN API URL
		,type:"post"
		,data:$("#form").serialize() 								// 요청 변수 설정
		,dataType:"jsonp"											// 크로스도메인으로 인한 jsonp 이용, 검색결과형식 JSON 
		,crossDomain:true
		,success:function(jsonStr){									// jsonStr : 주소 검색 결과 JSON 데이터			
			$("#list").html("");									// 결과 출력 영역 초기화
			var errCode = jsonStr.results.common.errorCode;
			var errDesc = jsonStr.results.common.errorMessage;
			if(errCode != "0"){ 
				alert(errCode+"="+errDesc);
			}else{
				if(jsonStr!= null){
					makeListJson(jsonStr);							// 결과 JSON 데이터 파싱 및 출력
				}
			}
		}
		,error: function(xhr,status, error){
			alert("에러발생");										// AJAX 호출 에러
		}
	});
}
function makeListJson(jsonStr){
	var htmlStr = "";
	htmlStr += "<table>";
	// jquery를 이용한 JSON 결과 데이터 파싱
	$(jsonStr.results.juso).each(function(){
		htmlStr += "<tr>";
		htmlStr += "<td>"+this.roadAddr+"</td>";
		htmlStr += "<td>"+this.roadAddrPart1+"</td>";
		htmlStr += "<td>"+this.roadAddrPart2+"</td>";
		htmlStr += "<td>"+this.jibunAddr+"</td>";
		htmlStr += "<td>"+this.engAddr+"</td>";
		htmlStr += "<td>"+this.zipNo+"</td>";
		htmlStr += "<td>"+this.admCd+"</td>";
		htmlStr += "<td>"+this.rnMgtSn+"</td>";
		htmlStr += "<td>"+this.bdMgtSn+"</td>";
		htmlStr += "<td>"+this.detBdNmList+"</td>";
		/** API 서비스 제공항목 확대 (2017.02) **/
		htmlStr += "<td>"+this.bdNm+"</td>";
		htmlStr += "<td>"+this.bdKdcd+"</td>";
		htmlStr += "<td>"+this.siNm+"</td>";
		htmlStr += "<td>"+this.sggNm+"</td>";
		htmlStr += "<td>"+this.emdNm+"</td>";
		htmlStr += "<td>"+this.liNm+"</td>";
		htmlStr += "<td>"+this.rn+"</td>";
		htmlStr += "<td>"+this.udrtYn+"</td>";
		htmlStr += "<td>"+this.buldMnnm+"</td>";
		htmlStr += "<td>"+this.buldSlno+"</td>";
		htmlStr += "<td>"+this.mtYn+"</td>";
		htmlStr += "<td>"+this.lnbrMnnm+"</td>";
		htmlStr += "<td>"+this.lnbrSlno+"</td>";
		htmlStr += "<td>"+this.emdNo+"</td>";
		htmlStr += "</tr>";
	});
	htmlStr += "</table>";
	// 결과 HTML을 FORM의 결과 출력 DIV에 삽입
	$("#list").html(htmlStr);
}	
</script>
<title>OPEN API 샘플 소스</title>
</head>
<body>
<form name="form" id="form" method="post">
  <input type="hidden" name="currentPage" value="1"/>				<!-- 요청 변수 설정 (현재 페이지. currentPage : n > 0) -->
  <input type="hidden" name="countPerPage" value="10"/>				<!-- 요청 변수 설정 (페이지당 출력 개수. countPerPage 범위 : 0 < n <= 100) -->
  <input type="hidden" name="resultType" value="json"/> 			<!-- 요청 변수 설정 (검색결과형식 설정, json) --> 
  <input type="hidden" name="confmKey" value="TESTJUSOGOKR"/>		<!-- 요청 변수 설정 (승인키) -->
  <input type="text" name="keyword" value=""/>						<!-- 요청 변수 설정 (키워드) -->
  <input type="button" onClick="getAddr();" value="주소검색하기"/>
  <div id="list"> <!-- 검색 결과 리스트 출력 영역 --> </div>
</form>
</body>
</html>