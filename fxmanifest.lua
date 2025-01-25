fx_version "bodacious"
game "gta5"

author "DnzxDevop"
version "1.0.0"

ui_page "src/web/index.html"

shared_scripts {
	'src/shared/controller.lua'
}

client_scripts {
	"@vrp/config/Native.lua",
	"@vrp/lib/Utils.lua",
	"src/client/*"
}

server_scripts {
	"@vrp/lib/Utils.lua",
	"src/server/*"
}

files {
	"src/web/*",
	"src/web/**/*"
}