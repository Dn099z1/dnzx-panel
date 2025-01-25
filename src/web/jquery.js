$(document).ready(function () {
	document.onkeyup = function (data) {
	  if (data["which"] == 27) {
		$.post("http://panel/closeSystem");
	  }
	};

	$("#search-input").on("input", function() {
	  const searchTerm = $(this).val().toLowerCase();
	  $("#members-list tr").each(function() {
		const id = $(this).find("td:first").text().toLowerCase();
		const name = $(this).find("td:nth-child(2)").text().toLowerCase();
		const matches = id.includes(searchTerm) || name.includes(searchTerm);
		$(this).toggle(matches);
	  });
	});
  });
  
  window.addEventListener("message", function (event) {
	switch (event["data"]["action"]) {
	  case "openSystem":
		$("#Body").css("display", "flex");
		$(".Title").html(event["data"]["title"]);
		Groups();
		break;
  
	  case "closeSystem":
		$("#Body").css("display", "none");
		break;
  
	  case "Update":
		Groups();
		break;
	}
  });
  
  const Groups = () => {
	$.post("http://panel/Request", "", (data) => {
	  const List = data["Result"].sort((a, b) => (a["Passport"] > b["Passport"]) ? 1 : -1);
	  $("#total-members").text(List.length);
	  $("#online-members").text(List.filter(item => item["Status"]).length);
	  $("#admin-count").text(List.filter(item => item["Hierarchy"] = `Chefe`).length);

  
	  $("#members-list").html(`
		${List.map((item) => {
		  const initials = item["Name"].split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
		  return `
			<tr class="member-row">
			  <td>${item["Passport"]}</td>
			  <td>
				<div class="member-name">
				  <div class="member-avatar">${initials}</div>
				  ${item["Name"]}
				</div>
			  </td>
			  <td><span class="hierarchy-badge">${item["Hierarchy"]}</span></td>
			  <td>
				<span class="status-badge ${item["Status"] ? 'status-online' : 'status-offline'}">
				  <i class="fa-solid fa-circle"></i>
				  ${item["Status"] ? 'Online' : 'Offline'}
				</span>
			  </td>
			  <td>
				<div class="actions">
				  <button class="btn-icon promote-btn" title="Promover" data-passport="${item["Passport"]}" data-hierarchy="${item["Hierarchy"]}">
					<i class="fa-solid fa-chevron-up"></i>
				  </button>
				  <button class="btn-icon demote-btn" title="Rebaixar" data-passport="${item["Passport"]}" data-hierarchy="${item["Hierarchy"]}">
					<i class="fa-solid fa-chevron-down"></i>
				  </button>
				  <button class="btn-icon Line-Remove" title="Remover" data-passport="${item["Passport"]}">
					<i class="fa-solid fa-trash"></i>
				  </button>
				</div>
			  </td>
			</tr>
		  `;
		}).join('')}
	  `);
	});
  };
  
  let memberToRemove = null;
  
  $(document).on("click", ".Line-Remove", function(e) {
	const row = $(this).closest('tr');
	const passport = $(this).data("passport");
	const name = row.find('.member-name').text().trim();
	
	memberToRemove = { passport, name };

	$('.member-preview-id').text(`ID: ${passport}`);
	$('.member-preview-name').text(name);
	
	$("#ConfirmModal").css("display", "block");
  });
  
  $(document).on("click", "#CancelRemove", function(e) {
	$("#ConfirmModal").css("display", "none");
	memberToRemove = null;
  });
  
  $(document).on("click", "#ConfirmRemove", function(e) {
	if (memberToRemove) {
	  $.post("http://panel/Remove", JSON.stringify({ passport: memberToRemove.passport }));
	  $("#ConfirmModal").css("display", "none");
	  memberToRemove = null;
	}
  });
  
  $(document).on("click", ".Add", function(e) {
	$("#Modal").css("display", "block");
	loadHierarchies();
  });
  
  $(document).on("click", "#Cancel", function(e) {
	$("#Modal").css("display", "none");
  });
  
  $(document).on("click", "#Save", function(e) {
	const passport = $(".Input").val();
	const hierarchy = $(".Hiera").val();
  
	if (!passport || !hierarchy) {
	  alert("Por favor, preencha todos os campos.");
	  return;
	}
  
	$("#Modal").css("display", "none");
	$.post("http://panel/Add", JSON.stringify({ passport, hierarchy }));
  });
  
  $(document).on("click", ".promote-btn", function(e) {
	const passport = $(this).data("passport");
	const currentHierarchy = parseInt($(this).data("hierarchy"));
	const newHierarchy = currentHierarchy + 1;
	
	$.post("http://panel/UpdateHierarchy", JSON.stringify({ 
	  passport: passport, 
	  hierarchy: newHierarchy 
	}));
  });
  
  $(document).on("click", ".demote-btn", function(e) {
	const passport = $(this).data("passport");
	const currentHierarchy = parseInt($(this).data("hierarchy"));
	const newHierarchy = Math.max(1, currentHierarchy - 1);
	
	$.post("http://panel/UpdateHierarchy", JSON.stringify({ 
	  passport: passport, 
	  hierarchy: newHierarchy 
	}));
  });
  
  const loadHierarchies = () => {
	$.post("http://panel/GetHierarchies", {}, function(data) {
	  const hierarchies = data.result;
	  let options = '<option value="">Selecione uma hierarquia</option>';
	  
	  Object.entries(hierarchies.names)
		.sort(([,a], [,b]) => b - a)
		.forEach(([name, level]) => {
		  options += `<option value="${level}">${name}</option>`;
		});
	  
	  $(".Hiera").html(options);
	});
  };