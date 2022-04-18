---@diagnostic disable: undefined-global
local HttpService = game:GetService("HttpService")
--[[
    4/18/2022
    Author: Erupt
    Description: Test sample for connecting through socket
]]

local Settings = {
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
    DiscordID = "" -- THIS IS IMPORTANT!
}

function runCode()
    warn(("Ran code at time (%d)"):format(os.time()))
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
    NewWebSocket.OnMessage:Connect(function(URL)
        local LoadedRaw, RawResult = pcall(game.HttpGet, game, URL)
        if LoadedRaw then
            local success, err = pcall(function()
                local func, err = loadstring(RawResult)
                if err then return err end 
                func()
            end)
            if not success then
                warn(("There was an error attempt to run the loaded string's code: (%s)"):format(err))
            end
        else
            warn(("There was an error attempting to load the raw text from (%s) .. : error (%s)"):format(URL, RawResult))
        end
    end)
end
