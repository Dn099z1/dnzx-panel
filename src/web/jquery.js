$(document).ready(function () {
	document.onkeyup = function (data) {
	  if (data["which"] == 27) {
		$.post("http://panel/closeSystem");
	  }
	};
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
	  
	  // Update stats
	  $("#total-members").text(List.length);
	  $("#online-members").text(List.filter(item => item["Status"]).length);
	  $("#admin-count").text(List.filter(item => item["Hierarchy"] == `Chefe`).length);
  
	  $("#members-list").html(`
		${List.map((item) => {
		  return `
			<tr class="member-row">
			  <td>${item["Passport"]}</td>
			  <td>
				<div class="member-name">
				  <img src="${item["Avatar"]}" alt="${item["Hierarchy"]}" class="member-avatar" onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(item["Name"])}&background=3b82f6&color=fff'"/>
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
	$("#Modal").css("display", "none");
	$.post("http://panel/Add", JSON.stringify({ passport: $(".Input").val(), hierarchy: $(".Hiera").val() }));
  });
  
  $(document).on("click", ".promote-btn", function(e) {
	const passport = $(this).data("passport");
	const currentHierarchy = $(this).data("hierarchy");
	const newHierarchy = currentHierarchy;
	
	$.post("http://panel/UpdateHierarchy", JSON.stringify({ 
	  passport: passport, 
	  downgrade : 0,
	  hierarchy: newHierarchy 
	}));
  });
  
  $(document).on("click", ".demote-btn", function(e) {
	const passport = $(this).data("passport");
	const currentHierarchy = $(this).data("hierarchy");
	const newHierarchy = Math.max(1, currentHierarchy - 1);
	
	$.post("http://panel/UpdateHierarchy", JSON.stringify({ 
	  passport: passport, 
	  downgrade : 1,
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