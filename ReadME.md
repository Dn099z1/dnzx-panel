# Painel de Gerenciamento de Membros para FiveM

Este é um **painel standalone** para gerenciamento de membros em organizações dentro do FiveM. O painel apresenta um visual moderno, é fácil de usar e completamente configurável pelo arquivo `controller.lua`.

## **Painel de Gerenciamento de Membros**

---

## ⚙️ **Recursos**
- Totalmente **standalone** (independe de frameworks como Creative ou vRP).
- Configuração centralizada no arquivo `controller.lua`.
- Estatísticas automáticas: membros totais, membros online e administradores.
- Sistema de busca e filtros integrados.
- Funções de gerenciamento: **promover**, **rebaixar** e **remover** membros.
- Export disponível para abrir o painel a partir de outros scripts.
- Interface moderna e responsiva.

---

## 📦 **Dependências**


---

## 🚀 **Instalação**
1. **Adicione ao `server.cfg`**:
   Adicione a linha abaixo ao seu `server.cfg` para garantir que o script seja carregado:
   ```plaintext
   ensure panel


## ⚙️ Adaptar

  Adicione o codigo ao seu framework (Creative) (NetWork,Rework,Enchanted,Extended)
  
  ```lua
  function vRP.SetPermQuantum(Passport, Permission, HierarchyName)
   local Datatable = vRP.GetServerData("Permissions:"..Permission)
   if Groups[Permission] then
       local hierarchy = Groups[Permission]["Hierarchy"]
       local Level = nil
       for i, role in ipairs(hierarchy) do
           if role == HierarchyName then
               Level = i
               break
           end
       end
       if not Level then
           Level = #hierarchy
       end
       Datatable[tostring(Passport)] = Level
       vRP.ServiceEnter(vRP.Source(Passport), tostring(Passport), Permission, true)
       vRP.Query("entitydata/SetData", { Name = "Permissions:"..Permission, Information = json.encode(Datatable) })
   end
end

------

function vRP.UpdateHierarchy(Passport, Permission)
    local Datatable = vRP.GetServerData("Permissions:"..Permission)
    if Groups[Permission] then
        local hierarchy = Groups[Permission]["Hierarchy"]
        local currentLevel = Datatable[tostring(Passport)]
        
        if currentLevel and currentLevel > 1 then
            currentLevel = currentLevel - 1
            Datatable[tostring(Passport)] = currentLevel
            vRP.ServiceEnter(vRP.Source(Passport), tostring(Passport), Permission, true)
            vRP.Query("entitydata/SetData", { Name = "Permissions:"..Permission, Information = json.encode(Datatable) })
        end
    end
end

------------

function vRP.DowngradeHierarchy(Passport, Permission)
    local Datatable = vRP.GetServerData("Permissions:"..Permission)
    if Groups[Permission] then
        local hierarchy = Groups[Permission]["Hierarchy"]
        local currentLevel = Datatable[tostring(Passport)]
        
        if currentLevel and currentLevel < #hierarchy then
            currentLevel = currentLevel + 1
            Datatable[tostring(Passport)] = currentLevel
            vRP.ServiceEnter(vRP.Source(Passport), tostring(Passport), Permission, true)
            vRP.Query("entitydata/SetData", { Name = "Permissions:"..Permission, Information = json.encode(Datatable) })
        end
    end
end
  ```
