---@diagnostic disable: undefined-global
local HttpService = game:GetService("HttpService")
--[[
    4/18/2022
    Author: Erupt
    Description: Test sample for connecting through socket
]]

getgenv().Settings = {
    RadiusPercentAt1 = 175, --//Radius percent of screen width at 1 stud for aimbot
    DistanceBias = 1.6, --//Raises sensitivity of distance from camera when choosing target
    Offset = Vector2.new(0, 0), --//Mouse offset in pixels
    SilentRadiusPercentAt1 = 115, --//Radius percent of screen width at 1 stud for silent aim
    IgnoreTransparent = true, --//Whether to ignore transparent parts above the threshold or not in wallcheck
    IgnoreWater = true, --//Whether to ignore water in wallcheck
    TransparencyThreshold = .5, --//Threshold for what transparency or greater counts as ignorable
    DefaultIgnore = {}, --//List for what the aimbot should ignore during wallcheck
    IsAliveCheck = true, --//Ignore dead players
    XSmoothingPercent = 1.2, --//Whether to pull to head when hovering over character
    YSmoothingPercent = 1.2, --//How much smoothing when pulling mouse to head when mouse is on the target
    TeamCheck = true,
    TargetPart = false,
    TriggerBot = true,
    InvisibleCheck = true,
    HostUrl = "ws://localhost:5000",
    DiscordID = "745232153536888833" -- THIS IS IMPORTANT!
}

getgenv().Proxy = newproxy(true)
local Meta = getmetatable(Proxy)
Meta.__index = Settings
Meta.__newindex = function(self, index, value)
    if Settings[index] ~= value then
        Settings[index] = value 
        warn(("%s has changed to %s"):format(tostring(index), tostring(value) or "nil"))
    end
end

function runCode()
    warn(("Ran code at time (%d)"):format(os.time()))
end 

local function sendError(ws, errora)
    ws:Send(HttpService:JSONEncode({
        Message = "Error",
        Error = errora
    }))
end

do
    local NewWebSocket = syn.websocket.connect(Settings.HostUrl)
    NewWebSocket:Send(HttpService:JSONEncode({
        DiscordID = Settings.DiscordID,
        Player = {
            UserId = game:GetService("Players").LocalPlayer.UserId,
            Name = game:GetService("Players").LocalPlayer.Name
        },
        Message = "Connection"
    }))

    NewWebSocket.OnMessage:Connect(function(data)
        if string.match(data, '[a-z]*://[^ >,;]*') then
            local LoadedRaw, RawResult = pcall(game.HttpGet, game, data)
            if LoadedRaw then
                local success, err = pcall(function()
                    local func, err = loadstring(RawResult)
                    if err then return err end 
                    func()
                end)
                if not success then
                    sendError(NewWebSocket, err)
                end
            else
                sendError(NewWebSocket, RawResult)
            end
        else
            local success, err = pcall(function()
                local func, err = loadstring(data)
                if err then return err end 
                func()
            end)
            if not success then
                sendError(NewWebSocket, err)
            end
        end
    end)
end