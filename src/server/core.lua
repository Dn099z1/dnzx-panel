-----------------------------------------------------------------------------------------------------------------------------------------
-- VRP
-----------------------------------------------------------------------------------------------------------------------------------------
local Tunnel = module("vrp", "lib/Tunnel")
local Proxy = module("vrp", "lib/Proxy")
vRP = Proxy.getInterface("vRP")
-----------------------------------------------------------------------------------------------------------------------------------------
-- CONNECTION
-----------------------------------------------------------------------------------------------------------------------------------------
Quantum = {}
Tunnel.bindInterface("panel", Quantum)
-----------------------------------------------------------------------------------------------------------------------------------------
-- VARIABLES
-----------------------------------------------------------------------------------------------------------------------------------------
local Panel = {}
-----------------------------------------------------------------------------------------------------------------------------------------
-- SERVICE:TOGGLE
-----------------------------------------------------------------------------------------------------------------------------------------
-- RegisterServerEvent("service:Toggle")
-- AddEventHandler("service:Toggle", function(Service)
-- 	local source = source
-- 	local Passport = Controller.GetIdentifier(source)
-- 	Controller.ServiceToggle(source,Passport,Service)
-- end)
-----------------------------------------------------------------------------------------------------------------------------------------
-- PAINEL
-----------------------------------------------------------------------------------------------------------------------------------------
function openPanel(source, Permission)
    local Passport = Controller.GetIdentifier(source)
    if Passport and Permission then
        if Controller.HasPermission(Passport, Permission, 1) then
            Panel[Passport] = Permission
            TriggerClientEvent("panel:Open", source, Permission)
        end
    end
end

exports('openPanel', openPanel)


-----------------------------------------------------------------------------------------------------------------------------------------
-- REQUEST
-----------------------------------------------------------------------------------------------------------------------------------------
function Quantum.Request()
	local source = source
	local Passport = Controller.GetIdentifier(source)
	if Passport and Panel[Passport] then
		local Members = {}
		local Sources = Controller.Players()
		local Entitys = Controller.DataGroups(Panel[Passport])
		for Number, v in pairs(Entitys) do
			local Number = parseInt(Number)
			local Identity = Controller.Data(Number)
			local Avatar = Identity["Avatar"]
			if Identity then
				local hierarchyName = Controller.Hierarchy(Panel[Passport])[Controller.GetUserHierarchy(Number, Panel[Passport])]

				Members[#Members + 1] = {
					["Name"] = Identity["Name"].." "..Identity["Lastname"],
					["Status"] = Sources[Number],
					["Passport"] = Number,
					["Hierarchy"] = hierarchyName,
					["Avatar"] = Avatar,
				}
			end
		end

		return Members
	end
end
-----------------------------------------------------------------------------------------------------------------------------------------
-- PANEL:REMOVE
-----------------------------------------------------------------------------------------------------------------------------------------
RegisterServerEvent("panel:Remove")
AddEventHandler("panel:Remove", function(Number)
	local source = source
	local Number = parseInt(Number)
	local Passport = Controller.GetIdentifier(source)

	if Passport and Panel[Passport] then
		
		if Controller.HasPermission(Passport, Panel[Passport], 1) then
			Controller.RemovePermission(Number, Panel[Passport])
			Controller.Notify("amarelo", "Passaporte removido.", "Atenção", 5000)
			TriggerClientEvent("panel:Update", source)
		end
	end
end)
-----------------------------------------------------------------------------------------------------------------------------------------
-- SERVICE:ADD
-----------------------------------------------------------------------------------------------------------------------------------------
RegisterServerEvent("service:Add")
AddEventHandler("service:Add", function(Number,Hierarchy)
	--print(Hierarchy)
	local source = source
	local Number = parseInt(Number)
	local Hierarchy = parseInt(Hierarchy)
	local Passport = Controller.GetIdentifier(source)
	if Passport and Panel[Passport] then
		if Controller.HasPermission(Passport, Panel[Passport], 1) then
			--print(Panel[Passport])
			Controller.GivePermission(Number, Panel[Passport], Hierarchy)

			Controller.Notify( "verde", "Passaporte adicionado.", "Sucesso" ,5000)
			TriggerClientEvent("service:Update", source)
		end
	end
end)
-----------------------------------------------------------------------------------------------------------------------------------------
-- SERVICE:UpdateHierarchy
-----------------------------------------------------------------------------------------------------------------------------------------
RegisterServerEvent("service:UpdateHierarchy")
AddEventHandler("service:UpdateHierarchy", function(data)
	local source = source
	local Passport = Controller.GetIdentifier(source)
	if Passport and Panel[Passport] then
		if Controller.HasPermission(Passport, Panel[Passport], 1) then
			local targetPassport = tonumber(data.passport)
			local newHierarchy = data.hierarchy
			if data.downgrade == 0 then
				Controller.UpdateHierarchy(targetPassport, Panel[Passport])
				Controller.Notify("verde", "Hierarquia atualizada.", "Sucesso", 5000)
				TriggerClientEvent("service:Update", source)
			else
				Controller.DowngradeHierarchy(targetPassport, Panel[Passport])
				Controller.Notify("verde", "Hierarquia atualizada.", "Sucesso", 5000)
				TriggerClientEvent("service:Update", source)
			end
		end
	end
end)
-----------------------------------------------------------------------------------------------------------------------------------------
-- SERVICE:GetHierarchies
-----------------------------------------------------------------------------------------------------------------------------------------
function Quantum.GetHierarchies()
	local source = source
	local Passport = Controller.GetIdentifier(source)
	if Passport and Panel[Passport] then
		local hierarchies = {}
		local allHierarchies = Controller.Hierarchy(Panel[Passport])
		
		for name, level in pairs(allHierarchies) do
			hierarchies[name] = level
		end
		
		return {
			names = hierarchies
		}
	end
	return {}
end

Citizen.CreateThread(function()

    local orange = "^3"
    local purple = "^5"
    print(purple .. "Painel Feito Por " .. orange .. "Quantum Devs " .. purple .. "🌟")
    print(purple .. "Desenvolvedor: " .. orange .. "DnzxDevop " .. purple .. "💻")
    print(orange .. "Obrigado por usar nosso painel! 😎 🚀")
end)
