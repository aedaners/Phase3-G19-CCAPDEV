/* Function openTab() activates the menu button from the html */
function openTab(menuList, option) {
    //declaration of variables
    var d; //for the date
    var i; //counter
    var menuContent; //content for each menu
    var menulink; //for menu buttons

    //getting the content from html
    menuContent = document.getElementsByClassName("menuContent");
    for (i = 0; i < menuContent.length; i++) {
      menuContent[i].style.display = "none";
    }
  
    //activating menu buttons
    menulink = document.getElementsByClassName("menulink");
    for (i = 0; i < menulink.length; i++) {
      menulink[i].className = menulink[i].className.replace(" active", "");
    }
    
    document.getElementById(option).style.display = "block";
    menuList.currentTarget.className = menuList.currentTarget.className + " active";

    // Shows time and date in each menu pages
    d = new Date();
    document.getElementById("timeDate").innerHTML = d;
}


//function for search results (advanced searching)
$(document).ready(function() {
	$('.test').click(function() {
		//get value of date1
		var date1 = $('#date1').val();
		console.log(date1);
		//get value of time1
		var time1 = $('#time1').val();
		console.log(time1);
		if(date1 == '' || time1 == '') {
			window.location.href = 'none.html';
		}
		else if(date1 == "2023-04-04"){
			window.location.href = 'results.html';
		}else{
			window.location.href = 'none.html';
		}
	});
});

