//https://docs.microsoft.com/en-us/aspnet/core/tutorials/signalr?view=aspnetcore-5.0&tabs=visual-studio



//Focus on next input
$(".roomCodeFields input").on("input", function () {
    let sibling = $(this).next();
    if (sibling.length > 0) {
        sibling.focus();
    }
    else {
        $("#JoinRoom").focus();
    }
})

//Join room
$("#StartPageView form").on("submit", function (e) {
    e.preventDefault();
    let codeArray = [];

    $(".roomCodeFields input").each(function (index, item) {
        codeArray.push($(item).val());
    })
   
    const roomCode = codeArray.join("");
    if (roomCode.length === 6) {
        window.location.href = "/" + roomCode
    }
    else {
        //Error, could not join a room
    }
})