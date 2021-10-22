const connection = new signalR.HubConnectionBuilder().withUrl("/lootHub").build();

//SignalR Listeners
connection.on("UpdateUserList", function () {
    LootApp.UpdateUserList();
});

connection.on("AddUser", function (data) {
    LootApp.AddUser(data);
});


connection.on("RollResult", function (data) {
    LootApp.Games.Roll.Result(data);
});

connection.on("Logger", function (data) {
    console.log("LOGGER", data);
});


//Run game actions
$(".StartGame").on("click", function () {
    const game = $(this).data().game;
    console.log("GAMETYPE", game);
    switch (game) {
        case 'roll':
            LootApp.Games.Roll.Start()
            break;
        default:
            console.log("Something went wrong...");
    }
});

$("#SaveSettings").on("click", function () {
    //Update username
    LootApp.Username = $("#SettingsUsername").val();
    localStorage.setItem("username", LootApp.Username);

    connection.invoke("UpdateAllUsers", LootApp.Code)
});

const LootApp = {
    Code: "",
    Username: "",
    Users: [],
    Initialize: function (code) {
        LootApp.Code = code;

        LootApp.Username = localStorage.getItem("username");
        if (!LootApp.Username) {
            LootApp.Username = prompt("Enter your username");
            localStorage.setItem("username", LootApp.Username);
        }
        $("#SettingsUsername").val(LootApp.Username);

        connection.start().then(function () {
            connection.invoke("CreateOrJoinRoom", LootApp.Code);
        });
    },
    UpdateUserList: function () {
        LootApp.Users = [];
        $("#UserList").empty();
        connection.invoke("UpdateUserData", LootApp.Code, LootApp.Username)
    },
    AddUser: function (data) {
        LootApp.Users.push(data);
        $("#UserList").append('<li data-type="user" class="list-group-item list-group-item-dark fw-bold" data-name="' + data + '">' + data + '</li>');
    },
    Games: {
        Roll: {
            Start: function () {
                connection.invoke("RollGame", LootApp.Code, LootApp.Users)
            },
            Result: function (data) {
                LootApp.AddAlert(data);
                $('.StartGame').prop('disabled', true);
                setTimeout(function () {
                    $('.StartGame').prop('disabled', false);
                }, 1000);
            }
        }
    },
    AddAlert: function (data) {
        let currentdate = new Date();
        let datetime = currentdate.getHours() + ":"
            + (currentdate.getMinutes() < 10 ? 10 + currentdate.getMinutes() : currentdate.getMinutes()) + ":"
            + (currentdate.getSeconds() < 10 ? 10 + currentdate.getSeconds() : currentdate.getSeconds());

        let colorClass;
        let colorNumber = Math.floor(Math.random() * 100) % 5;
        switch (colorNumber) {
            case 1:
                colorClass = "success"
                break;
            case 2:
                colorClass = "danger"
                break;
            case 3:
                colorClass = "info"
                break;
            case 4:
                colorClass = "warning"
                break;
            default:
                colorClass = "secondary"
                break;
        }

        var alert = $('<div class="alert alert-' + colorClass + ' alert-dismissible" role="alert">' + data + '<span class="float-end">' + datetime + '</span><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>');
        alert.hide();
        $("#WinnerList").prepend(alert);
        alert.show(500);
        LootApp.PlaySound();


        if ($("#WinnerList").find(".alert").length > 2) {
            $("#WinnerList").find(".alert").eq(2).nextAll(".alert").hide(1000, function () {
                $("#WinnerList").find(".alert").last().remove();
            });
        }
    },
    PlaySound: function () {
        var audio = new Audio('/media/notification.wav');
        audio.play();
    }
}
