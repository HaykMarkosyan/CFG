var OS = navigator.platform;

if(OS == "Win32"){
    document.getElementById("windows").className = "btn btn-success btn-lg"
    document.getElementById("mac").className = "btn btn-primary"
} else if(OS == "Win16") {
    document.getElementById("windows").className = "btn btn-success btn-lg"
    document.getElementById("mac").className = "btn btn-primary"
} else if(OS = "MacPPC"){
    document.getElementById("mac").className = "btn btn-success btn-lg"
    document.getElementById("windows").className = "btn btn-primary"
} else if(OS = "Mac68K"){
    document.getElementById("mac").className = "btn btn-success btn-lg"
    document.getElementById("windows").className = "btn btn-primary"
} else {
    document.getElementById("windows").className = "btn btn-primary"
    document.getElementById("mac").className = "btn btn-primary"
}