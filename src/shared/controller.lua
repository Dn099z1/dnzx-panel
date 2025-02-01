
Controller = {
    GetIdentifier = function(source)
        return vRP.Passport(source)
    end,

    Notify = function(css,message,title,time)
        TriggerClientEvent("Notify", source, css, message, title, time)
    end,

    RemovePermission = function(Passport,Permission)
        return vRP.RemovePermission(Passport,Permission)
    end,

    UpdateHierarchy = function(Passport,Permission)
        return vRP.UpdateHierarchy(Passport,Permission)
    end,

    DowngradeHierarchy = function(Passport,Permission)
        return vRP.DowngradeHierarchy(Passport,Permission)
    end,

    ServiceToggle = function(source,Passport,Service)
        if Passport then
           return vRP.ServiceToggle(source, Passport, Service, false)
        end
    end,

    Players = function()
        return vRP.Players()
    end,

    DataGroups = function(Passport)
        return vRP.DataGroups(Passport)
    end,

    Data = function(Passport)
        return vRP.Identity(Passport)
    end,

    Hierarchy = function(Passport)
        return vRP.Hierarchy(Passport)
    end,

    GetUserHierarchy = function(Number, Group)
        return vRP.GetUserHierarchy(Number, Group)
    end,

    RemovePermission = function(Number, Group)
        return vRP.RemovePermission(Number, Group)
    end,

    GivePermission = function(Number, Group,Hierarchy)
        return vRP.SetPermQuantum(Number, Group,Hierarchy)
    end,

    HasPermission = function(Number, Group)
        return vRP.HasPermission(Number, Group)
    end
}
