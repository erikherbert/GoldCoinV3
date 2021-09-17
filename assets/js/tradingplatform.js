var Is2FAEnabled=0;
var assetId=0;
//Call Ajax function
var callAjax = function (url, type, data, callback)
{
	var header=localStorage.getItem("accesstoken");
    url === url;
    $.ajax({
        type: type,
        url: url,
		dataType: "json",
        data: data,
		contentType: 'application/json',
		headers: {
         "authorization": header     
         },
  		success: function (data, textStatus, request) {
            callback(data, textStatus, request);
        },
        error: function (result) {
			if(result.status==401)
			{
			window.location.href="./signin.html";	
			}
			else{
         	swal("Error", "There is some problem. Please try again!!!", "error");
		
			 $.unblockUI();
			}  }
    });
};
//Call Ajax function
var callAjaxfuncwithoutdata = function (url, type, callback)
{
	var header=localStorage.getItem("accesstoken");   
    url === url;
    $.ajax({
        type: type,
		contentType: 'application/json',
		dataType: "json",
        url: url,
		headers: {
         "authorization": header     
         },
        success: function (result,textStatus, request) {
			 callback(result, textStatus, request);
        },
        error: function (result) {       
           if(result.status==401)
			{
			window.location.href="./signin.html";	
			}else{		
            	swal("Error", "There is some problem. Please try again!!!", "error");
		
			 $.unblockUI();
        }}
    });
};

//Call Ajax function
var callAjaxfuncwithoutdata2 = function (url, type, callback)
{
	var header=localStorage.getItem("accesstoken");   
    url === url;
    $.ajax({
        type: type,
		contentType: 'application/json',
		dataType: "json",
        url: url,
		headers: {
         "authorization": header     
         },
        success: function (result,textStatus, request) {
			 callback(result, textStatus, request);
        },
        error: function (result) {       
           }
    });
};

//Call Ajax function
var callAjaxwithOutHeader = function (url, type, callback)
{
	var header=localStorage.getItem("accesstoken");   
    url === url;
    $.ajax({
        type: type,
		contentType: 'application/json',
		dataType: "json",
        url: url,
      success: function (result) {
            callback(result);
        },
        error: function (result) {       
           if(result.status==401)
			{
			window.location.href="./signin.html";	
			}else{		
            	//swal("Error", "There is some problem. Please try again!!!", "error");
		
			 $.unblockUI();
        }}
    });
};

//SOCKET CONNECTION
testWebSocket();
function testWebSocket()
  {
    websocket = new WebSocket("ws://178.79.177.89:8080/");
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
  }

  function onOpen(evt)
  {
   console.log(evt);
   websocket.send("connect");
initializeApp();
  }

  function onClose(evt)
  {
	  testWebSocket();
  }

  function onMessage(evt)
  {
try{
  var data=toCamel(JSON.parse(evt.data));  
  if(data.assetId==assetId && data["from"]!="client")
  {
	  if(data.type=="orderbook")
	  {getOrderBook_Callback(data.result);}
      if(data.type=="marketdata")
	  {marketData_Callback(data.result);
  getMarketDataPrice(assetId);}
  }}
catch(err){err.message;}
  
  }

  function onError(evt)
  {
	  testWebSocket();
  }

function initializeApp()
{
	var data={
		type:"orderbook",
		from:"client",
		assetId:assetId
	}
      websocket.send(JSON.stringify(data));
	  
	  var data={
		type:"marketdata",
		from:"client",
		assetId:assetId
	}
	 websocket.send(JSON.stringify(data));
	 
}

function toCamel(o) {
  var newO, origKey, newKey, value
  if (o instanceof Array) {
    return o.map(function(value) {
        if (typeof value === "object") {
          value = toCamel(value)
        }
        return value
    })
  } else {
    newO = {}
    for (origKey in o) {
      if (o.hasOwnProperty(origKey)) {
        newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString()
        value = o[origKey]
        if (value instanceof Array || (value !== null && value.constructor === Object)) {
          value = toCamel(value)
        }
        newO[newKey] = value
      }
    }
  }
  return newO
}
//SOCKET END


function loginredirect()
{
	window.location.href="./signin.html";
}
function logout()
{
    localStorage.removeItem("accesstoken");   
	window.location.href="./signin.html";
}

function loginUser()
{	
document.getElementById('captcha').innerHTML="";
    if ($('#Email').val() === '' || $('#Password').val() === '')
    {
       // alert('Please Fill the Email/Password');
		swal.fire("Error", "Please Fill the Email/Password", "error");
		
        return false;
    }
    var username = $("#Email").val();//Fetch Email value
    var password = $("#Password").val();//Fetch password value
	var v = grecaptcha.getResponse();
  
	if(v.length == 0)
    {
        document.getElementById('captcha').innerHTML="Please check Re-Captcha";
        return false;
    } 
	var data = {
	email:username,
	password:password,
	captcha:v
	}

	console.log(data);

	  $.blockUI({message: '<img width="30" height="30" src="assets/img/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
	callAjax(BaseURL+'login', 'POST', JSON.stringify(data), Login_Callback);
}
var hash="";
function Login_Callback(result, textStatus, request)
{
	  if(result.status)
	  {  
   localStorage.setItem("accesstoken","Bearer "+request.getResponseHeader('Authorization'));
    if(result.data.enabled==1){
	hash=result.data.hash;
  $("#form2fa").show();$("#formlogin").hide(); }else
  { 
   
    window.location.href="./index.html"; 
  }
  }
      else
	  {
		 // swal.fire("Error", result.message, "error");
		 grecaptcha.reset();
      swal.fire("Error", result.message, "error");
					
		}
	   $.unblockUI();
	
	   
}

function verify2FAlogin()
{	
var code =$("#code").val();
if(code === '')
	{
	swal.fire("Error", "code can not be blank", "error");
		return false;
	}
	 $.blockUI({message: '<img width="30" height="30" src="assets/img/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
	 callAjaxfuncwithoutdata(BaseURL+'verify2falogin/'+code+'/'+hash, 'GET', verify2FAlogin_Callback);
}

function verify2FAlogin_Callback(result,textStatus, request)
{$.unblockUI();
	  if(result.status)
	  { 
   localStorage.setItem("accesstoken","Bearer "+request.getResponseHeader('Authorization'));
    window.location.href="./index.html";}
      else{swal.fire("Error", result.message, "error");}
	   $.unblockUI();
	   
}

function signupUser()
{	
    var fullname = $("#fullname").val();
    var username = $("#email").val();	
    var email = $("#email").val();
    var password = $("#password").val();
	var referrercode = "NA";
    var confirmpassword = $("#cnfrmpassword").val();
	
	if(fullname === '')
	{
		//alert("Fullname can not be blank");
		swal.fire("Error", "Fullname can not be blank", "error");
		return false;
	}
	if(username==='')
	{
		//alert("Username can not be blank");
		swal.fire("Error", "Username can not be blank", "error");
		return false;
	}
	if(email === '')
	{
		//alert("Email can not be blank");
		swal.fire("Error", "Email can not be blank", "error");
		return false;
	}
	if(password === '')
	{
		//alert("Password can not be blank");
		swal.fire("Error", "Password can not be blank", "error");
		return false;
	}
	if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) return swal.fire("Error", "You have entered an invalid email address!", "error"), !1;
    if (password != confirmpassword) return swal.fire("Error", "Password and Retype Password Mismatch", "error"), !1;
   
	var data = {
    username: username,
    password: password,
    email: email,
    name: fullname,
    referralCode: referrercode,
    newsLetterSubscription: true
	}
	 $.blockUI({message: '<img width="30" height="30" src="assets/img/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
	 callAjax(BaseURL+'signup', 'POST', JSON.stringify(data), SignUp_Callback);
}

function SignUp_Callback(result)
{
	  if(result.status)
	  {  window.location.href="./verification.html";}
      else{swal.fire("Error", result.message, "error");}
	   $.unblockUI();
	 //localStorage.setItem("accesstoken", result.accesstoken);
	   
}
function EmailVerification(data)
{	
	 $.blockUI({message: '<img width="30" height="30" src="assets/img/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
	callAjax(BaseURL+'verifyemail', 'POST',data, EmailVerification_Callback);
}

function EmailVerification_Callback(result)
{
	  if(result.status)
	  {  
       $("#emailmessage").html("Email Verified Successfully");
window.location.href="./after-registration.html";
       }else{$("#emailmessage").html("Acccount not found");}
    
	   $.unblockUI();	   
}



function changePassword()
{	
      var password = $("#oldpassword").val();
     var confirmpassword = $("#confirmpassword").val();
	 var newpassword = $("#newpassword").val();
	
	if(password === '')
	{
		
		//alert("Old Password can not be blank");
		swal.fire("Error", "Current Password can not be blank", "error");
		return false;
	}

	if(newpassword === '')
	{
		//alert("New Password can not be blank");
		swal.fire("Error", "New Password can not be blank", "error");
		return false;
	}
    if (newpassword != confirmpassword) return swal.fire("Error", "New Password and Confirm Password Mismatch", "error"), !1;
   
	var data = {
    newPassword: newpassword,
    oldPassword: password,
	facode:$("#facode").val()
  	}
	 $.blockUI({message: '<img width="30" height="30" src="assets/img/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
	 callAjax(BaseURL+'changepassword', 'POST', JSON.stringify(data), ChangePassword_Callback);
}

function ChangePassword_Callback(result)
{
	  if(result.status)
	  {  //alert("Password Changed Successfully");
  swal.fire("Success", "Password Changed Successfully", "success");
     $("#oldpassword").val("");
     $("#confirmpassword").val("");
	 $("#newpassword").val("");
  }
      else{swal.fire("Error", result.message, "error");}
	   $.unblockUI();
	 //localStorage.setItem("accesstoken", result.accesstoken);
	   
}

function forgotPassword()
{	
  	 var email = $("#email").val();
	if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) return swal.fire("Errot","You have entered an invalid email address!","error"), !1;	   
	data=email;
	 $.blockUI({message: '<img width="30" height="30" src="assets/img/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
	 callAjax(BaseURL+'forgotpassword', 'POST', JSON.stringify(data), ForgotPassword_Callback);
}

function ForgotPassword_Callback(result)
{
if(result.status)
	  {  window.location.href="./resetlinkconfirmation.html";}
      else{swal.fire("Error", result.message, "error");}
	   $.unblockUI();
	   
}

function resetPassword() {
if($("#password").val() ==='')
{
	swal.fire("Error", "Password can not be blank", "error");
	//alert("Password can not be blank") 
 return false;
}	
if($("#password").val() != $("#cnfrmpassword").val())
{
	//alert("New Password and Confirm Password Mismatch") 
	swal.fire("Error", "New Password and Confirm Password Mismatch", "error");
 return false;
}var sPageURL = window.location.search.substring(1);
var sURLVariables = sPageURL.split('&');
var pemail=sURLVariables[0].split('=')[1];
var phash=sURLVariables[1].split('=')[1];

    var data = {
        newpassword:$("#password").val(),
		email:pemail,
		hash:phash
        
    };
		$.blockUI({message: '<img width="30" height="30" src="assets/img/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
    callAjax(BaseURL +"forgotpasswordchange", "POST", JSON.stringify(data), Resetpassword_Callback)
   

}

function Resetpassword_Callback(result)
{
if(result.status)
	  {  window.location.href="./resetpasswordstatus.html";}
      else{swal.fire("Error", result.message, "error");}
	   $.unblockUI();
	   
}


function isNumberKey(evt)
       {
          var charCode = (evt.which) ? evt.which : evt.keyCode;
          if (charCode != 46 && charCode > 31 
            && (charCode < 48 || charCode > 57))
             return false;
if((evt.currentTarget.value.includes('.')) && charCode==46)
{
return	false;
}
if((evt.currentTarget.value.length==0) && charCode==46)
{
return	false;
}

          return true;
       }			  

function isOnlyNumberKey(evt)
       {
          var charCode = (evt.which) ? evt.which : evt.keyCode;
          if (charCode > 31 
            && (charCode < 48 || charCode > 57))
             return false;


          return true;
       }
	   
function checksession()
{
	var header= localStorage.getItem("accesstoken");
	if(header==undefined || header == "")
	{
		window.location.href="./signin.html";	
			
	}
}	   
	 

function Register2fa()
{	
	 $.blockUI({message: '<img width="30" height="30" src="assets/img/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
	 callAjaxfuncwithoutdata(BaseURL+'register2fa', 'GET', Register2fa_Callback);
}
var enabled2fa=0;
function Register2fa_Callback(result)
{$.unblockUI();
	  if(result.status)
	  {
		  $("#qrcode").attr("src",result.data.url);



		  $("#tfacode").html(result.data.code);
		  if(result.data.enabled==1)
		   {
			   enabled2fa=1;
			     $('#tfa').prop("checked", true);
             $(".tfa-wrap").show();			 
		 
			   $("#fadiv").hide();$("#btnValidate").hide(); $('#tfacode').hide();}
			   else
			   {
				   enabled2fa=0;
				    $('#tfa').prop("checked", false);
             $(".tfa-wrap").hide();			 
		  
				   $("#fadiv").show();$("#btnValidate").show();$('#tfacode').show();
	   }}
      else{swal.fire("Error", result.message, "error");}
	   $.unblockUI();
	   
}

function Verify2fa()
{	
var code =$("#code").val();
	 $.blockUI({message: '<img width="30" height="30" src="images/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
	 callAjaxfuncwithoutdata(BaseURL+'verify2fa/'+code, 'GET', Verify2fa_Callback);
}

function Verify2fa_Callback(result)
{    $.unblockUI();
	  if(result.status)
	  { 
 swal.fire("Success","","success").then((willDelete) => {
  if (willDelete) {
    	window.location.reload();

    
  } 
});
 	
	}
      else{swal.fire("Error", result.message, "error");}
	   $.unblockUI();
	     
}

 function SecurityChange(){
	   
	 if(!$('#tfa').is(':checked'))
	 {
		 if(enabled2fa==1){
			 
			 
		 
		 swal.fire("Please Enter 2-FA Code to Turn OFF:", {
  content: "input",
  icon:"info"
})
.then((value) => {
  if (value != null && value!="") 
		 {
			Disable2FA(value);
         }
		 else
		 {
			 $('#tfa').prop("checked", true);
             $(".tfa-wrap").show();			 
		 }
});
		 
		 }else{$('#tfa').prop("checked", false);
             
             $(".tfa-wrap").hide();}		 
	  }else{$('#tfa').prop("checked", true);
             
             $(".tfa-wrap").show();}
    }
	
	
function Disable2FA(code)
{	if(code!="")
	{
	 $.blockUI({message: '<img width="30" height="30" src="images/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
	 callAjaxfuncwithoutdata(BaseURL+'disable2fa/'+code, 'GET', Disable2FA_Callback);
	}}

function Disable2FA_Callback(result)
{    $.unblockUI();
	  if(result.status)
	  { //alert("2-FA Successfully Disabled");
  swal.fire("Success", "2-FA Successfully Disabled", "success");
  enabled2fa=0;
$(".tfa-wrap").hide();
window.location.reload();	
	  }
      else{$('#tfa').prop("checked", true);
             $(".tfa-wrap").show();swal.fire("Error", result.message, "error");}
	   $.unblockUI();
	     
}	

function SubmitCode()
{
	if($("#code").val().length==6)
	{
		Verify2fa();
	}
}	 

function getCustomerInformation()
{	
	 $.blockUI({message: '<img width="30" height="30" src="assets/img/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
	callAjaxfuncwithoutdata(BaseURL+'customerinformation', 'GET', getCustomerInformation_Callback);
}

function getCustomerInformation_Callback(result)
{
	  if(result.status)
	  {
		$("#fullname").html(result.data[0].name);
		$("#email").html(result.data[0].email);
		$("#formFirst").val(result.data[0].name);
		$("#formEmail").val(result.data[0].email);
		
		Is2FAEnabled=result.data[0].is2FAEnabled;
		if(Is2FAEnabled==0){
		$("#fabox").hide();}
      }
      else{swal.fire("Error", result.message, "error");}
	   $.unblockUI();
	   
}

function getCustomerAssets()
{	
	 $.blockUI({message: '<img width="30" height="30" src="assets/img/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
	callAjaxfuncwithoutdata(BaseURL+'customerassets', 'GET', getCustomerAssets_Callback);
}

function getCustomerAssets_Callback(result)
{
	  if(result.status)
	  {
		 $("#assetslist").html("");
		for(var i=0;i<result.data.info.length;i++)
		{
			$("#assetlist").append('<tr onclick="window.location=\'index.html?assetId='+result.data.info[i].asset.id+'&assetName='+result.data.info[i].asset.symbol+'\'"> <td class="d-flex"><div class="file-thumbnail me-2"><img src="'+result.data.info[i].asset.imageUrl+'"></img></div>'+result.data.info[i].asset.name+'</td> <td>'+result.data.info[i].customer.balance.toFixed(2)+'</td> <td><i class="icon ion-md-lock"></i>'+result.data.info[i].customer.lockedBalance.toFixed(2)+'</td> </tr>');

		}
		$("#totalBal").html((parseFloat(result.data.balance)+parseFloat(result.data.lockedBalance)).toFixed(2));
		$("#lockBal").html(result.data.lockedBalance.toFixed(2));
		$("#availableBal").html(result.data.balance.toFixed(2));
		
      }
      else{swal.fire("Error", result.message, "error");}
	   $.unblockUI();
	   
}
function getAssets1(type)
{	
	// $.blockUI({message: '<img width="30" height="30" src="assets/img/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
	callAjaxfuncwithoutdata(BaseURL+'assets/'+type, 'GET', getAssets_Callback1);
}

function getAssets_Callback1(result)
{
	  if(result.status)
	  {
		 $("#pills-home").html("");
		for(var i=0;i<result.data.length;i++)
		{
			$("#pills-home").append('<li id="asset_'+result.data[i].symbol+'" class="productlist-product mb-3 d-flex flex-nowrap justify-content-between" onclick="orderData('+result.data[i].id+',\''+result.data[i].symbol+'\')">                    <div class="file-thumbnail me-2">                        <img class="fit-cover rounded-3" src="'+result.data[i].imageUrl+'" alt="">                    </div>                    <div class="me-3 w-100">                        <h6 id="name_'+result.data[i].symbol+'" class="mb-1">'+result.data[i].name+'</h6>                        <div class="d-flex flex-nowrap justify-content-between">                            <h6 class="text-secondary" id="asset_'+result.data[i].id+'_price">0.00</h6><span class="badge bg-success" id="asset_'+result.data[i].id+'_change"><i class="bi-caret-up-fill"></i> +0.00 (0.00%)</span>                        </div>                    </li>                                   </div>');
		}
	    }
      else{swal.fire("Error", result.message, "error");}
	   $.unblockUI();
	   
}

function getAssets()
{	
	// $.blockUI({message: '<img width="30" height="30" src="assets/img/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
	callAjaxfuncwithoutdata(BaseURL+'assets', 'GET', getAssets_Callback);
}

function getAssets_Callback(result)
{
	  if(result.status)
	  {
		 $("#assetslist").html("");

		for(var i=0;i<result.data.length;i++)
		{
			$("#assetlist").append('<tr onclick="orderData('+result.data[i].id+',\''+result.data[i].symbol+'\')"> <td><i class="icon ion-md-star"></i>'+result.data[i].symbol+'</td> <td id="asset_'+result.data[i].id+'_price">0.00</td> <td id="asset_'+result.data[i].id+'_change" class="green">+0.0%</td> </tr>');

		}

      }
      else{swal.fire("Error", result.message, "error");}
	   $.unblockUI();
	   
}


function getCustomerBal(assetId)
{	
	 $.blockUI({message: '<img width="30" height="30" src="assets/img/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
	callAjaxfuncwithoutdata(BaseURL+'customerbalance/'+assetId, 'GET', getCustomerBal_Callback);
}

function getCustomerBal_Callback(result)
{
	  if(result.status)
	  {
		$(".availableBal").html(result.data.balance);
		$(".lockedBal").html(result.data.lockedBalance);
		$(".availableAsset").html(result.data.assetBal+" "+assetName);
		$(".lockedAsset").html(result.data.assetLocked+" "+assetName);
      }
      else{swal.fire("Error", result.message, "error");}
	   $.unblockUI();
	   
}


function getOrderBook(assetId)
{	
	 //$.blockUI({message: '<img width="30" height="30" src="assets/img/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
	callAjaxfuncwithoutdata2(BaseURL+'orderbook/'+assetId, 'GET', getOrderBook_Callback);
}

function getOrderBook_Callback(result)
{
	  if(result.status)
	  {
		  $("#tborderbook tbody").html("");
		 for(var i=0;i<result.data.executedOrder.length;i++)
		{
			var classorder=result.data.executedOrder[i].orderType==1?"red":"green";
		$("#tborderbook tbody").append('<tr><td>'+new Date(result.data.executedOrder[i].create_Date).toLocaleTimeString()+'</td><td class="'+classorder+'">'+result.data.executedOrder[i].unitPrice+'</td><td>'+result.data.executedOrder[i].quantity+'</td></tr>');
      	
		}
		$("#tbsellorder").html("");
		for(var i=0;i<result.data.sellOrder.length;i++)
		{
		$("#tbsellorder").append('<tr class="red'+getOrderClass(result.data.sellOrder[i].executedQuantity,result.data.sellOrder[i].quantity)+'"><td class="red">'+result.data.sellOrder[i].unitPrice+'</td><td>'+result.data.sellOrder[i].quantity+'</td><td>'+(result.data.sellOrder[i].quantity*result.data.sellOrder[i].unitPrice).toFixed(2)+'</td></tr>');
      	
		}
		$("#tbbuyorder").html("");
		for(var i=0;i<result.data.buyOrder.length;i++)
		{
		$("#tbbuyorder").append('<tr class="green'+getOrderClass(result.data.buyOrder[i].executedQuantity,result.data.buyOrder[i].quantity)+'"><td class="green">'+result.data.buyOrder[i].unitPrice+'</td><td>'+result.data.buyOrder[i].quantity+'</td><td>'+(result.data.buyOrder[i].quantity*result.data.buyOrder[i].unitPrice).toFixed(2)+'</td></tr>');
      	
		}
		if(result.data.marketdata!=null){
		$("#unitprice").html(result.data.marketdata.lastPrice);
		
		if(parseFloat(result.data.marketdata.change)<0)
{	
     $("#change").addClass("red");
$("#change").removeClass("green");
$("#change").html(result.data.marketdata.change+"%");
			
}else{
$("#change").addClass("green");
$("#change").removeClass("red");	
$("#change").html("+"+result.data.marketdata.change+"%");
		
		}	}else{$("#unitprice").html("0.00");
		$("#change").html("0.0%");$("#change").addClass("green");
$("#change").removeClass("red");}
		}
      else{swal.fire("Error", result.message, "error");}
	  // $.unblockUI();
	   
}

function getMarketDataPrice()
{	
	callAjaxfuncwithoutdata2(BaseURL+'marketdataprice', 'GET', getMarketDataPrice_Callback);
}

function getMarketDataPrice_Callback(result)
{
	  if(result.status)
	  {
for(var i=0;i<result.data.length;i++)
		{
$("#asset_"+result.data[i].assetId+"_price").html(parseFloat(result.data[i].lastPrice).toFixed(2));

if(parseFloat(result.data[i].change)<0)
{	
$("#asset_"+result.data[i].assetId+"_change").html("<i class='bi-caret-down-fill'></i>-0.00 ("+result.data[i].change+"%)");
$("#asset_"+result.data[i].assetId+"_change").addClass("bg-danger"); 
$("#asset_"+result.data[i].assetId+"_change").removeClass("bg-success");      	
}else{
	$("#asset_"+result.data[i].assetId+"_change").html("<i class='bi-caret-up-fill'></i>+0.00 ("+result.data[i].change+"%)");
$("#asset_"+result.data[i].assetId+"_change").addClass("bg-success"); 
$("#asset_"+result.data[i].assetId+"_change").removeClass("bg-danger"); 	
}		}
	  }
   
	   
}

function marketData(assetId)
{	
	callAjaxfuncwithoutdata2(BaseURL+'marketdata/'+assetId, 'GET', marketData_Callback);
}

function marketData_Callback(result)
{
	  if(result.status)
	  {
var data=[];
for(var i=0;i<result.data.length;i++)
		{
			data.push([result.data[i].create_Date,result.data[i].low,result.data[i].high,result.data[i].open,result.data[i].close,result.data[i].lastPrice]);
	  }
ChartLoad(data);

	  }
	   
}

function BuyOrder(assetId,type)
{	
if($("#buyamount").val()==""||$("#buyquantity").val()=="")
{
	swal.fire("Error", "Please fill details", "error");
	return;
}
        	var data = {
				assetsId:assetId,
    orderType: type,
    unitPrice: parseFloat($("#buyamount").val()),
	quantity:parseInt($("#buyquantity").val()),
	action:0,
	customerId:-1
  	}
	 $.blockUI({message: '<img width="30" height="30" src="assets/img/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
	 callAjax(BaseURL+'placeorder', 'POST', JSON.stringify(data), BuyOrder_Callback);
}
function BuyOrder2(assetId,type)
{	
if($("#buyamount2").val()==""||$("#buyquantity2").val()=="")
{
	swal.fire("Error", "Please fill details", "error");
	return;
}
        	var data = {
				assetsId:assetId,
    orderType: type,
    unitPrice: parseFloat($("#buyamount2").val()),
	quantity:parseInt($("#buyquantity2").val()),
	action:0,
	customerId:-1
  	}
	 $.blockUI({message: '<img width="30" height="30" src="assets/img/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
	 callAjax(BaseURL+'placeorder', 'POST', JSON.stringify(data), BuyOrder_Callback);
}
function BuyOrder_Callback(result)
{
	  if(result.status)
	  {  //alert("Password Changed Successfully");
  swal.fire("Success", result.message, "success");
  marketData(assetId);
	getCustomerBal(assetId);
     Orders(assetId,'open');
  }
      else{swal.fire("Error", result.message, "error");}
	   $.unblockUI();
	 //localStorage.setItem("accesstoken", result.accesstoken);
	   
}

function SellOrder(assetId,type)
{	
if($("#sellamount").val()==""||$("#sellquantity").val()=="")
{
	swal.fire("Error", "Please fill details", "error");
	return;
}

        	var data = {
				assetsId:assetId,
    orderType: type,
    unitPrice: parseFloat($("#sellamount").val()),
	quantity:parseFloat($("#sellquantity").val()),
	action:1,
	customerId:-1
  	}
	 $.blockUI({message: '<img width="30" height="30" src="assets/img/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
	 callAjax(BaseURL+'placeorder', 'POST', JSON.stringify(data), SellOrder_Callback);
}

function SellOrder2(assetId,type)
{	
if($("#sellamount2").val()==""||$("#sellquantity2").val()=="")
{
	swal.fire("Error", "Please fill details", "error");
	return;
}

        	var data = {
				assetsId:assetId,
    orderType: type,
    unitPrice: parseFloat($("#sellamount2").val()),
	quantity:parseFloat($("#sellquantity2").val()),
	action:1,
	customerId:-1
  	}
	 $.blockUI({message: '<img width="30" height="30" src="assets/img/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
	 callAjax(BaseURL+'placeorder', 'POST', JSON.stringify(data), SellOrder_Callback);
}

function SellOrder_Callback(result)
{
	  if(result.status)
	  {  //alert("Password Changed Successfully");
  
  swal.fire("Success", result.message, "success");
  marketData(assetId);
	getCustomerBal(assetId);
     Orders(assetId,'open');
  }
      else{swal.fire("Error", result.message, "error");}
	   $.unblockUI();
	 //localStorage.setItem("accesstoken", result.accesstoken);
	   
}
function CancelOrder(orderId)
{
	 $.blockUI({message: '<img width="30" height="30" src="assets/img/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
	 callAjaxfuncwithoutdata(BaseURL+'cancelorder/'+orderId, 'GET',  CancelOrders_Callback);


}

function CancelOrders_Callback(result)
{
	  if(result.status)
	  {  
  Orders(assetId,'open');
  getCustomerBal(assetId);
    
 swal.fire("Success", "Order Cancelled Successfully", "success");
	  }
      else{swal.fire("Error", result.message, "error");}
	   $.unblockUI();
		   
}
var type="";
function Orders(assetId,type)
{	this.type=type;
	 $.blockUI({message: '<img width="30" height="30" src="assets/img/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
	 callAjaxfuncwithoutdata(BaseURL+'orders/'+assetId+'/'+type, 'GET',  Orders_Callback);
}

function Orders_Callback(result)
{
	  if(result.status)
	  {  
  $("#tb"+type+"").html("");
  for(var i=0;i<result.data.length;i++)
		{var order= result.data[i];
			
			var orderMsg="";
			if(order.state==0)
			{orderMsg="Not Executed";}
		if(order.state==1)
			{orderMsg="Fully Executed";}
		if(order.state==2)
			{orderMsg="Partially Executed";}
		if(order.state==3)
			{orderMsg="Cancelled";}
			if(type=='open'){
   $("#tb"+type+"").append('<tr><td>'+new Date(order.create_Date).toLocaleTimeString()+'</td><td>All</td><td>All</td>'+(order.orderType==1?'<td class="red">Sell</td>':'<td class="green">Buy</td>')+'</td><td>'+order.unitPrice+'</td><td>'+order.quantity+'</td><td>'+order.executedQuantity+'</td><td>'+orderMsg+'</td><td><button onclick="CancelOrder('+order.id+')" class="btn btn-secondary btn-sm sell">Cancel</button></td></tr>');
		}else{ $("#tb"+type+"").append('<tr><td>'+new Date(order.create_Date).toLocaleTimeString()+'</td><td>All</td><td>All</td>'+(order.orderType==1?'<td class="red">Sell</td>':'<td class="green">Buy</td>')+'</td><td>'+order.unitPrice+'</td><td>'+order.quantity+'</td><td>'+order.executedQuantity+'</td><td>'+orderMsg+'</td></tr>');
	}}
	  if(result.data.length==0)
	  {
		  $("#tb"+type+"").html('<span class="no-data"><i class="icon ion-md-document"></i>No data</span>')
	  }
	  }
      else{swal.fire("Error", result.message, "error");}
	   $.unblockUI();
		   
}

function getOrderClass(executed, quantity)
{
	var res= (executed/quantity)*100;
	if(res>80)
	{return "-bg-80"}
if(res>60)
	{return "-bg-60"}
if(res>40)
	{return "-bg-40"}
if(res>10)
	{return "-bg-10"}
if(res>8)
	{return "-bg-8"}
if(res>5)
	{return "-bg-5"}

}

function filterAssets(type)
{
	var childrens= document.getElementById("pills-home").children;
	
	for(var ch in childrens)
	{
		if(!childrens[ch].innerText.includes(type))
		{
			document.getElementById("pills-home").removeChild(childrens[ch]);
		}
	}
}			  