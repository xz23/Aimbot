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
    InvisibleCheck = true
}

local z = "a"