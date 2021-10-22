using LootApp.Models;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LootApp.Hubs
{
    public class LootHub : Hub
    {
        public async Task CreateOrJoinRoom(string roomCode)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomCode);

            await Clients.Group(roomCode).SendAsync("UpdateUserList");
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            //TODO all clients will reload when someone leaves, rebuild with a static dictionary keeping track on groups
            await Clients.All.SendAsync("UpdateUserList");
            await base.OnDisconnectedAsync(exception);
        }

        public async Task UpdateUserData(string roomCode, string username)
        {
            await Clients.Group(roomCode).SendAsync("AddUser", username);
        }
        public async Task UpdateAllUsers(string roomCode)
        {
            await Clients.Group(roomCode).SendAsync("UpdateUserList");
        }

        public async Task RollGame(string roomCode, List<string> userList)
        {
            var winner = userList.OrderBy(x => Guid.NewGuid()).First();
            await Clients.Group(roomCode).SendAsync("RollResult", winner);
        }

        public async Task Logger(string message)
        {
            await Clients.All.SendAsync("Logger", message);
        }

    }
}
