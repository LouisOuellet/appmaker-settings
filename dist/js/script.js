API.Plugins.settings = {
	init:function(){
		API.GUI.Sidebar.Nav.add('Settings', 'administration');
	},
	load:{
		index:function(){ API.Plugins.settings.GUI.Tabs.init(); },
	},
	GUI:{
		Tabs:{
			init:function(){
				API.request('settings','fetch',{data:[]},function(result){
					json = JSON.parse(result);
					cron = json.output.cron;
					directory = json.output.directory;
					settings = json.output.settings;
					manifest = json.output.manifest;
					languages = json.output.languages;
					timezones = json.output.timezones;
					pages = json.output.pages;
					API.Plugins.settings.GUI.Tabs.add('overview',function(content, tab){
						var html = '';
						html += '<h3>'+API.Contents.Language['Security & Setup Warnings']+'</h3>';
						html += '<ul>';
						if(location.protocol !== 'https:'){ html += '<li>'+API.Contents.Language['HyperText Transfer Protocol Secure is currently not running.']+'</li>'; }
						if(cron.status && settings.background_jobs == 'cron'){
							html += '<li>';
								html += API.Contents.Language['It has been']+' '+cron.age+' '+API.Contents.Language['since the last cron ran.']+'<br />';
							html += '</li>';
							html += '<li>';
								html += API.Contents.Language['Make sure to setup your CRON as followed']+': <code>* * * * * php '+directory+'/cli.php --cron</code>';
							html += '</li>';
						}
						html += '</ul>';
						html += '<hr>';
						html += '<h3>'+API.Contents.Language['Updates']+'</h3>';
						html += '<div class="form-group">';
							html += '<div class="input-group">';
								html += '<div class="input-group-prepend">';
									html += '<span class="input-group-text">';
										html += '<i class="fas fa-code-branch mr-1"></i>'+API.Contents.Language['Branch'];
									html += '</span>';
								html += '</div>';
								html += '<select name="branch">';
								for(const [key, branch] of Object.entries(settings.repository.branches)){
									if(branch != ''){
										if(settings.repository.branch == branch){
											html += '<option value="'+branch+'" selected>'+API.Helper.ucfirst(branch)+'</option>';
										} else { html += '<option value="'+branch+'">'+API.Helper.ucfirst(branch)+'</option>'; }
									}
								}
								html += '</select>';
								html += '<div class="input-group-append">';
									html += '<button type="button" name="ChangeBranch" class="btn btn-success">';
			              html += '<i class="fas fa-save mr-1"></i></i>'+API.Contents.Language['Save'];
			            html += '</button>';
								html += '</div>';
							html += '</div>';
						html += '</div>';
						if(settings.build < manifest.build){
							html += '<div class="form-group">';
								html += '<div class="input-group">';
									html += '<div class="input-group-prepend">';
										html += '<span class="input-group-text">';
											html += '<i class="fas fa-exclamation-circle mr-1"></i>'+API.Contents.Language['A new version is available'];
											html += '<i class="fas fa-chevron-right ml-1"></i>';
										html += '</span>';
									html += '</div>';
									html += '<div class="input-group-append">';
				            html += '<button type="button" name="StartUpdate" class="btn btn-primary">';
				              html += '<i class="fas fa-cloud-download-alt mr-1"></i></i>'+API.Contents.Language['Update'];
				            html += '</button>';
									html += '</div>';
								html += '</div>';
							html += '</div>';
						}
						content.html(html);
						content.find('select').select2({ theme: 'bootstrap4' });
						content.find('button').each(function(){
							$(this).off().click(function(){
								switch($(this).attr('name')){
									case'StartUpdate': API.request('settings','update',{data:[]});break;
									case'ChangeBranch':
										settings.repository.branch = content.find('select').select2('val');
										API.request('settings','save',{data:{repository:settings.repository}});
										break;
								}
							});
						});
					});
					API.Plugins.settings.GUI.Tabs.add('basic',function(content, tab){
						var html = '', checked = '';
						html += '<h3>'+API.Contents.Language['Background Jobs']+'</h3>';
						html += '<div class="form-group clearfix">';
		          html += '<div class="icheck-primary">';
								if(settings.background_jobs == 'service'){ checked = 'checked'; } else { checked = ''; }
		            html += '<input type="radio" id="background_jobs1" value="service" name="background_jobs" '+checked+'>';
		            html += '<label for="background_jobs1">'+API.Contents.Language['Service']+'</label>';
		            html += '<p class="text-muted" style="margin-left:30px;">'+API.Contents.Language['The Service executes in a loop on the host system']+'</p>';
		          html += '</div>';
		          html += '<div class="icheck-primary">';
								if(settings.background_jobs == 'cron'){ checked = 'checked'; } else { checked = ''; }
		            html += '<input type="radio" id="background_jobs2" value="cron" name="background_jobs" '+checked+'>';
		            html += '<label for="background_jobs2">'+API.Contents.Language['Cron']+'</label>';
		            html += '<p class="text-muted" style="margin-left:30px;">'+API.Contents.Language['Use system cron service to call the cron.php file every 5 minutes.']+'</p>';
		          html += '</div>';
		        html += '</div>';
						html += '<hr>';
						html += '<h3>'+API.Contents.Language['Language']+'</h3>';
						html += '<div class="form-group row">';
		          html += '<div class="input-group">';
		            html += '<div class="input-group-prepend">';
		              html += '<span class="input-group-text">';
		                html += '<i class="fas fa-globe"></i>';
		              html += '</span>';
		            html += '</div>';
		            html += '<select class="form-control" name="language">';
									for(var [key, language] of Object.entries(languages)){
										if(settings.language == language){
											html += '<option value="'+language+'" selected>'+API.Helper.ucfirst(language)+'</option>';
										} else { html += '<option value="'+language+'">'+API.Helper.ucfirst(language)+'</option>'; }
									}
		            html += '</select>';
		          html += '</div>';
		        html += '</div>';
						html += '<hr>';
						html += '<h3>'+API.Contents.Language['Timezone']+'</h3>';
						html += '<div class="form-group row">';
		          html += '<div class="input-group">';
		            html += '<div class="input-group-prepend">';
		              html += '<span class="input-group-text">';
		                html += '<i class="fas fa-clock"></i>';
		              html += '</span>';
		            html += '</div>';
		            html += '<select class="form-control" name="timezone">';
									for(const [key, timezone] of Object.entries(timezones)){
										if(settings.timezone == timezone){
											html += '<option value="'+timezone+'" selected>'+timezone+'</option>';
										} else { html += '<option value="'+timezone+'">'+timezone+'</option>'; }
									}
		            html += '</select>';
		          html += '</div>';
		        html += '</div>';
						html += '<hr>';
						html += '<h3>'+API.Contents.Language['Landing Page']+'</h3>';
						html += '<div class="form-group row">';
		          html += '<div class="input-group">';
		            html += '<div class="input-group-prepend">';
		              html += '<span class="input-group-text">';
		                html += '<i class="fas fa-columns"></i>';
		              html += '</span>';
		            html += '</div>';
		            html += '<select class="form-control" name="page">';
									for(const [key, page] of Object.entries(pages)){
										if(settings.page == page){ html += '<option value="'+page+'" selected>'+API.Helper.ucfirst(page)+'</option>'; }
										else { html += '<option value="'+page+'">'+API.Helper.ucfirst(page)+'</option>'; }
									}
		            html += '</select>';
		          html += '</div>';
		        html += '</div>';
		        html += '<div class="form-group row">';
	            html += '<div class="input-group">';
                html += '<button type="button" name="SaveCRON" class="btn btn-success">';
                  html += '<i class="fas fa-save mr-1"></i>'+API.Contents.Language['Save'];
                html += '</button>';
	            html += '</div>';
		        html += '</div>';
						content.html(html);
						content.find('select').select2({ theme: 'bootstrap4' });
						content.find('button').each(function(){
							$(this).off().click(function(){
								switch($(this).attr('name')){
									case'SaveCRON':
										var data = {};
										data.background_jobs = content.find('input:checked').val();
										settings.background_jobs = content.find('input:checked').val();
										data.language = content.find('select[name="language"]').select2('val');
										settings.language = content.find('select[name="language"]').select2('val');
										data.timezone = content.find('select[name="timezone"]').select2('val');
										settings.timezone = content.find('select[name="timezone"]').select2('val');
										data.page = content.find('select[name="page"]').select2('val');
										settings.page = content.find('select[name="page"]').select2('val');
										API.request('settings','save',{data:data});
										break;
								}
							});
						});
					});
					API.Plugins.settings.GUI.Tabs.add('advanced',function(content, tab){
						var html = '', checked = '';
						html += '<h3>'+API.Contents.Language['Debug Mode']+'</h3>';
				    html += '<p>';
					    html += API.Contents.Language['Enabling debug mode will activate PHP error reporting. Along with the display of Debug data.'];
					    html += '<div class="alert alert-info">';
					        html += '<h5><i class="icon fas fa-info"></i>'+API.Contents.Language['Info']+'</h5>';
					        html += API.Contents.Language['This may cause some problems when navigating the application.'];
					    html += '</div>';
					    html += '<div class="alert alert-warning">';
					        html += '<h5><i class="icon fas fa-exclamation-triangle"></i>'+API.Contents.Language['Warning']+'</h5>';
					        html += API.Contents.Language['This may cause some protected data to be exposed unintentionally.'];
					    html += '</div>';
					    html += API.Contents.Language['Please use this option carefully.'];
				    html += '</p>';
				    html += '<div class="form-group clearfix">';
				      html += '<div class="icheck-primary">';
								if(typeof settings.debug !== 'undefined' && settings.debug){ checked = 'checked'; } else { checked = ''; }
				        html += '<input type="checkbox" id="debug" name="debug" '+checked+'>';
				        html += '<label for="debug">'+API.Contents.Language['Enable']+'</label>';
				      html += '</div>';
				    html += '</div>';
				    html += '<div class="form-group row">';
				      html += '<div class="input-group">';
				        html += '<button type="button" name="debug" class="btn btn-success"><i class="fas fa-save mr-1"></i>'+API.Contents.Language['Save']+'</button>';
				      html += '</div>';
				    html += '</div>';
					  html += '<hr>';
						html += '<h3>'+API.Contents.Language['Maintenance Mode']+'</h3>';
						html += '<p>';
					    html += API.Contents.Language['This mode allows an administrator to perform some tasks such as updating the application.'];
					    html += '<div class="alert alert-info">';
					      html += '<h5><i class="icon fas fa-info"></i>'+API.Contents.Language['Info']+'</h5>';
					      html += API.Contents.Language['Enabling maintenance mode will prevent users from accessing the application.'];
					    html += '</div>';
					    html += '<div class="alert alert-warning">';
					      html += '<h5><i class="icon fas fa-exclamation-triangle"></i>'+API.Contents.Language['Warning']+'</h5>';
					      html += API.Contents.Language['This may cause some data to be lost. Such as a completed form that was not yet submitted.'];
					    html += '</div>';
				    html += '</p>';
				    html += '<div class="form-group clearfix">';
				      html += '<div class="icheck-primary">';
								if(typeof settings.maintenance !== 'undefined' && settings.maintenance){ checked = 'checked'; } else { checked = ''; }
				        html += '<input type="checkbox" id="maintenance" name="maintenance" '+checked+'>';
				        html += '<label for="maintenance">'+API.Contents.Language['Enable']+'</label>';
				      html += '</div>';
				    html += '</div>';
				    html += '<div class="form-group row">';
				      html += '<div class="input-group">';
				        html += '<button type="button" name="maintenance" class="btn btn-success"><i class="fas fa-save mr-1"></i>'+API.Contents.Language['Save']+'</button>';
				      html += '</div>';
				    html += '</div>';
					  html += '<hr>';
						html += '<h3>'+API.Contents.Language['Developer Mode']+'</h3>';
						html += '<p>';
					    html += API.Contents.Language['This mode allows a developer to perform some changes to the application.'];
					    html += '<div class="alert alert-warning">';
					      html += '<h5><i class="icon fas fa-exclamation-triangle"></i>'+API.Contents.Language['Warning']+'</h5>';
					      html += API.Contents.Language['This may cause some data to be lost. Such as a completed form that was not yet submitted.'];
					    html += '</div>';
				    html += '</p>';
				    html += '<div class="form-group clearfix">';
				      html += '<div class="icheck-primary">';
								if(typeof settings.developer !== 'undefined' && settings.developer){ checked = 'checked'; } else { checked = ''; }
				        html += '<input type="checkbox" id="developer" name="developer" '+checked+'>';
				        html += '<label for="developer">'+API.Contents.Language['Enable']+'</label>';
				      html += '</div>';
				    html += '</div>';
				    html += '<div class="form-group row">';
				      html += '<div class="input-group">';
				        html += '<button type="button" name="developer" class="btn btn-success"><i class="fas fa-save mr-1"></i>'+API.Contents.Language['Save']+'</button>';
				      html += '</div>';
				    html += '</div>';
						content.html(html);
						content.find('button').each(function(){
							$(this).off().click(function(){
								switch($(this).attr('name')){
									case'developer':
										var data = {};
										if(content.find('input:checked[name="developer"]').val() != undefined){ data.developer = true;settings.developer = true; }
										else { data.developer = false;settings.developer = false; }
										API.request('settings','save',{data:data});
										break;
									case'maintenance':
										var data = {};
										if(content.find('input:checked[name="maintenance"]').val() != undefined){ data.maintenance = true;settings.maintenance = true; }
										else { data.maintenance = false;settings.maintenance = false; }
										API.request('settings','save',{data:data});
										break;
									case'debug':
										var data = {};
										if(content.find('input:checked[name="debug"]').val() != undefined){ data.debug = true;settings.debug = true; }
										else { data.debug = false;settings.debug = false; }
										API.request('settings','save',{data:data});
										break;
								}
							});
						});
					});
					API.Plugins.settings.GUI.Tabs.add('SQL',function(content, tab){
						var html = '';
						html += '<h3>'+API.Contents.Language['SQL Database']+'</h3>';
						html += '<div class="form-group row">';
				      html += '<div class="input-group">';
				        html += '<div class="input-group-prepend">';
				          html += '<span class="input-group-text">';
				            html += '<i class="fas fa-server"></i>';
				          html += '</span>';
				        html += '</div>';
				        html += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Host']+'" name="host" value="'+settings.sql.host+'">';
								html += '<div class="input-group-prepend">';
				          html += '<span class="input-group-text">';
				            html += '<i class="fas fa-database"></i>';
				          html += '</span>';
				        html += '</div>';
				        html += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Database']+'" name="database" value="'+settings.sql.database+'">';
				      html += '</div>';
				    html += '</div>';
				    html += '<div class="form-group row">';
				      html += '<div class="input-group">';
				        html += '<div class="input-group-prepend">';
				          html += '<span class="input-group-text">';
				            html += '<i class="fas fa-user"></i>';
				          html += '</span>';
				        html += '</div>';
				        html += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Username']+'" name="username" value="'+settings.sql.username+'">';
				        html += '<div class="input-group-prepend">';
				          html += '<span class="input-group-text">';
				            html += '<i class="fas fa-user-lock"></i>';
				          html += '</span>';
				        html += '</div>';
				        html += '<input type="password" class="form-control" placeholder="'+API.Contents.Language['Password']+'" name="password" value="'+settings.sql.password+'">';
				      html += '</div>';
				    html += '</div>';
						html += '<hr>';
						html += '<h3>'+API.Contents.Language['SQL Result Limit']+'</h3>';
						html += '<div class="form-group row">';
				      html += '<div class="input-group">';
				        html += '<div class="input-group-prepend">';
				          html += '<span class="input-group-text">';
				            html += '<i class="fab fa-slack-hash"></i>';
				          html += '</span>';
				        html += '</div>';
				        html += '<input type="number" class="form-control" name="SQLlimit" placeholder="'+API.Contents.Language['SQL Result Limit']+'" value="'+settings.SQLlimit+'">';
				      html += '</div>';
				    html += '</div>';
				    html += '<div class="form-group row">';
				      html += '<div class="input-group">';
				        html += '<button type="button" name="SaveSQL" class="btn btn-success">';
				          html += '<i class="fas fa-save mr-1"></i>'+API.Contents.Language['Save'];
				        html += '</button>';
				      html += '</div>';
				    html += '</div>';
						// html += '<hr>';
						// html += '<h3>'+API.Contents.Language['Import/Export']+'</h3>';
						// html += '<div class="form-group">';
						// 	html += '<div class="vertical-input-group">';
						// 		html += '<div class="input-group">';
				    //       html += '<div class="input-group-prepend">';
				    //         html += '<span class="input-group-text">';
				    //           html += '<i class="fas fa-file-import mr-2"></i>'+API.Contents.Language['Import'];
				    //         html += '</span>';
				    //       html += '</div>';
						// 			html += '<div class="custom-file">';
				    //         html += '<input type="file" class="custom-file-input" name="dbFile" id="dbFile">';
				    //         html += '<label class="custom-file-label" for="dbFile">'+API.Contents.Language['Choose file']+'</label>';
				    //       html += '</div>';
						// 		html += '</div>';
						// 		html += '<div class="input-group">';
						// 			html += '<div class="btn-group btn-block">';
						// 				html += '<button type="button" name="ExportDB" class="btn btn-primary">';
						// 					html += '<i class="fas fa-file-export mr-1"></i>'+API.Contents.Language['Export Database'];
						// 				html += '</button>';
						// 				html += '<button type="button" name="ImportDB" class="btn btn-success">';
						// 					html += '<i class="fas fa-file-import mr-1"></i>'+API.Contents.Language['Import Database'];
						// 				html += '</button>';
						// 			html += '</div>';
						// 		html += '</div>';
						// 	html += '</div>';
						// html += '</div>';
						content.html(html);
						content.find('button').each(function(){
							$(this).off().click(function(){
								switch($(this).attr('name')){
									case'SaveSQL':
										var data = {};
										data.sql = {};
										data.sql.host = content.find('input[name="host"]').val();
										settings.sql.host = content.find('input[name="host"]').val();
										data.sql.database = content.find('input[name="database"]').val();
										settings.sql.database = content.find('input[name="database"]').val();
										data.sql.username = content.find('input[name="username"]').val();
										settings.sql.username = content.find('input[name="username"]').val();
										data.sql.password = content.find('input[name="password"]').val();
										settings.sql.password = content.find('input[name="password"]').val();
										data.SQLlimit = content.find('input[name="SQLlimit"]').val();
										settings.SQLlimit = content.find('input[name="SQLlimit"]').val();
										API.request('settings','save',{data:data});
										break;
								}
							});
						});
					});
					API.Plugins.settings.GUI.Tabs.add('SMTP',function(content, tab){
						var html = '', checkSSL = '', checkSTARTTLS = '';
						if(typeof settings.smtp === 'undefined'){
							settings.smtp = { host:'', port:'', username:'', password:'', encryption:'' };
						}
						if(typeof settings.smtp.host === 'undefined'){ settings.smtp.host = ''; }
						if(typeof settings.smtp.port === 'undefined'){ settings.smtp.port = ''; }
						if(typeof settings.smtp.username === 'undefined'){ settings.smtp.username = ''; }
						if(typeof settings.smtp.password === 'undefined'){ settings.smtp.password = ''; }
						if(typeof settings.smtp.encryption === 'undefined'){ settings.smtp.encryption = ''; }
						if(settings.smtp.encryption == 'SSL'){ checkSSL = 'selected' }
						if(settings.smtp.encryption == 'STARTTLS'){ checkSTARTTLS = 'selected' }
						html += '<h3>'+API.Contents.Language['SMTP']+'</h3>';
						html += '<div class="form-group row">';
		          html += '<div class="input-group">';
		            html += '<div class="input-group-prepend">';
		              html += '<span class="input-group-text"><i class="fas fa-server"></i></span>';
		            html += '</div>';
		            html += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Host']+'" name="host" value="'+settings.smtp.host+'">';
		            html += '<div class="input-group-prepend">';
		              html += '<span class="input-group-text"><i class="fas fa-key"></i></span>';
		            html += '</div>';
								html += '<select name="encryption">';
									html += '<option value="SSL" '+checkSSL+'>'+API.Contents.Language['SSL']+'</option>';
									html += '<option value="STARTTLS" '+checkSTARTTLS+'>'+API.Contents.Language['STARTTLS']+'</option>';
								html += '</select>';
		            html += '<div class="input-group-prepend">';
		              html += '<span class="input-group-text"><i class="fas fa-ethernet"></i></span>';
		            html += '</div>';
		            html += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Port']+'" name="port" value="'+settings.smtp.port+'">';
		          html += '</div>';
		        html += '</div>';
						html += '<div class="form-group row">';
	            html += '<div class="input-group">';
                html += '<div class="input-group-prepend">';
                  html += '<span class="input-group-text"><i class="fas fa-user"></i></span>';
                html += '</div>';
                html += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Username']+'" name="username" value="'+settings.smtp.username+'">';
                html += '<div class="input-group-prepend">';
                  html += '<span class="input-group-text"><i class="fas fa-user-lock"></i></span>';
                html += '</div>';
                html += '<input type="password" class="form-control" placeholder="'+API.Contents.Language['Password']+'" name="password" value="'+settings.smtp.password+'">';
	            html += '</div>';
		        html += '</div>';
		        html += '<div class="form-group row">';
	            html += '<div class="input-group">';
		            html += '<div class="btn-group">';
	                html += '<button type="button" name="SaveSMTP" class="btn btn-success">';
	                  html += '<i class="fas fa-save mr-1"></i>'+API.Contents.Language['Save'];
	                html += '</button>';
	                html += '<button type="button" name="testSMTP" class="btn btn-info">';
	                  html += '<i class="fas fa-paper-plane mr-1"></i>'+API.Contents.Language['Test'];
	                html += '</button>';
		            html += '</div>';
			        html += '</div>';
						html += '</div>';
						content.html(html);
						content.find('button').each(function(){
							$(this).off().click(function(){
								switch($(this).attr('name')){
									case'SaveSMTP':
										var data = {};
										data.smtp = {};
										data.smtp.host = content.find('input[name="host"]').val();
										settings.smtphost = content.find('input[name="host"]').val();
										data.smtp.port = content.find('input[name="port"]').val();
										settings.smtp.port = content.find('input[name="port"]').val();
										data.smtp.username = content.find('input[name="username"]').val();
										settings.smtp.username = content.find('input[name="username"]').val();
										data.smtp.password = content.find('input[name="password"]').val();
										settings.smtp.password = content.find('input[name="password"]').val();
										data.smtp.encryption = content.find('select[name="encryption"]').val();
										settings.smtp.encryption = content.find('select[name="encryption"]').val();
										API.request('settings','save',{data:data});
										break;
									case'testSMTP':
										API.request('settings','send',{data:""});
										break;
								}
							});
						});
					});
					// API.Plugins.settings.GUI.Tabs.add('LDAP',function(content, tab){
					// 	var html = '';
					// 	if(typeof settings.ldap === 'undefined'){
					// 		settings.ldap = { host:'', port:'', username:'', password:'', domain:'', base:'', branches:'' };
					// 	}
					// 	if(typeof settings.ldap.host === 'undefined'){ settings.ldap.host = ''; }
					// 	if(typeof settings.ldap.port === 'undefined'){ settings.ldap.port = ''; }
					// 	if(typeof settings.ldap.username === 'undefined'){ settings.ldap.username = ''; }
					// 	if(typeof settings.ldap.password === 'undefined'){ settings.ldap.password = ''; }
					// 	if(typeof settings.ldap.domain === 'undefined'){ settings.ldap.domain = ''; }
					// 	if(typeof settings.ldap.base === 'undefined'){ settings.ldap.base = ''; }
					// 	if(typeof settings.ldap.branches === 'undefined'){ settings.ldap.branches = ''; }
					// 	html += '<h3>'+API.Contents.Language['LDAP Database']+'</h3>';
					// 	html += '<div class="form-group row">';
	        //     html += '<div class="input-group">';
          //       html += '<div class="input-group-prepend">';
          //         html += '<span class="input-group-text"><i class="fas fa-server"></i></span>';
          //       html += '</div>';
          //       html += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Host']+'" name="host" value="'+settings.ldap.host+'">';
          //       html += '<div class="input-group-prepend">';
          //         html += '<span class="input-group-text"><i class="fas fa-ethernet"></i></span>';
          //       html += '</div>';
          //       html += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Port']+'" name="port" value="'+settings.ldap.port+'">';
	        //     html += '</div>';
		      //   html += '</div>';
					// 	html += '<div class="form-group row">';
		      //     html += '<div class="input-group">';
		      //       html += '<div class="input-group-prepend">';
		      //         html += '<span class="input-group-text"><i class="fas fa-database"></i></span>';
		      //       html += '</div>';
		      //       html += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Domain']+'" name="domain" value="'+settings.ldap.domain+'">';
		      //       html += '<div class="input-group-prepend">';
		      //         html += '<span class="input-group-text"><i class="fas fa-code-branch"></i></span>';
		      //       html += '</div>';
		      //       html += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Base DN']+'" name="base" value="'+settings.ldap.base+'">';
		      //     html += '</div>';
		      //   html += '</div>';
					// 	html += '<div class="form-group row">';
		      //     html += '<div class="input-group">';
		      //       html += '<div class="input-group-prepend">';
		      //         html += '<span class="input-group-text"><i class="fas fa-user"></i></span>';
		      //       html += '</div>';
		      //       html += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Username']+'" name="username" value="'+settings.ldap.username+'">';
		      //       html += '<div class="input-group-prepend">';
		      //         html += '<span class="input-group-text"><i class="fas fa-user-lock"></i></span>';
		      //       html += '</div>';
		      //       html += '<input type="password" class="form-control" placeholder="'+API.Contents.Language['Password']+'" name="password" value="'+settings.ldap.password+'">';
		      //     html += '</div>';
		      //   html += '</div>';
					// 	html += '<div class="form-group row">';
		      //     html += '<div class="input-group">';
		      //       html += '<div class="input-group-prepend">';
		      //         html += '<span class="input-group-text"><i class="fas fa-code-branch"></i></span>';
		      //       html += '</div>';
					// 			var branches = '';for(const [key, branch] of Object.entries(settings.ldap.branches)){ branches += branch+"\n"; }
		      //       html += '<textarea class="form-control" rows="6" placeholder="'+API.Contents.Language['One LDAP branch per line...']+'" style="resize: none;" name="branches">'+branches+'</textarea>';
		      //     html += '</div>';
		      //   html += '</div>';
					// 	html += '<div class="form-group row">';
		      //     html += '<div class="input-group">';
		      //       html += '<button type="button" name="SaveLDAP" class="btn btn-success">';
		      //         html += '<i class="fas fa-save mr-1"></i>'+API.Contents.Language['Save'];
		      //       html += '</button>';
		      //     html += '</div>';
		      //   html += '</div>';
					// 	content.html(html);
					// 	content.find('button').off().click(function(){
					// 		var settings = {ldap:{branches:[]}};
					// 		content.find('input').each(function(){
					// 			var key = $(this).attr('name');
					// 			settings.ldap[key] = content.find('input[name="'+key+'"]').val();
					// 		});
					// 		for(var [key, branch] of Object.entries(content.find('textarea').val().split("\n"))){ settings.ldap.branches.push(branch); }
					// 		settings.customization = API.Contents.Settings.customization;
					// 		API.request('settings','save',{data:{settings:settings}});
					// 	});
					// });
					// API.Plugins.settings.GUI.Tabs.add('LSP',function(content, tab){
					// 	var html = '';
					// 	if(typeof settings.lsp === 'undefined'){
					// 		settings.lsp = { host:'', application:'', token:'' };
					// 	}
					// 	if(typeof settings.lsp.host === 'undefined'){ settings.lsp.host = ''; }
					// 	if(typeof settings.lsp.application === 'undefined'){ settings.lsp.application = ''; }
					// 	if(typeof settings.lsp.token === 'undefined'){ settings.lsp.token = ''; }
					// 	if(typeof settings.license === 'undefined'){ settings.license = ''; }
					// 	html += '<h3>'+API.Contents.Language['Licensing Server']+'</h3>';
					// 	html += '<div class="form-group row">';
					// 		html += '<div class="input-group">';
					// 			html += '<div class="input-group-prepend">';
					// 				html += '<span class="input-group-text"><i class="fas fa-server"></i></span>';
					// 			html += '</div>';
					// 			html += '<input type="text" class="form-control" name="host" placeholder="'+API.Contents.Language['Host']+'" value="'+settings.lsp.host+'">';
					// 		html += '</div>';
					// 	html += '</div>';
					// 	html += '<div class="form-group row">';
					// 		html += '<div class="input-group">';
					// 			html += '<div class="input-group-prepend">';
					// 				html += '<span class="input-group-text"><i class="fas fa-archive"></i></span>';
					// 			html += '</div>';
					// 			html += '<input type="text" class="form-control" name="application" placeholder="'+API.Contents.Language['Application']+'" value="'+settings.lsp.application+'">';
					// 		html += '</div>';
					// 	html += '</div>';
					// 	html += '<div class="form-group row">';
					// 		html += '<div class="input-group">';
					// 			html += '<div class="input-group-prepend">';
					// 				html += '<span class="input-group-text"><i class="fas fa-ticket-alt"></i></span>';
					// 			html += '</div>';
					// 			html += '<input type="password" class="form-control" name="token" placeholder="'+API.Contents.Language['Token']+'" value="'+settings.lsp.token+'">';
					// 		html += '</div>';
					// 	html += '</div>';
					// 	html += '<hr>';
					// 	html += '<div class="form-group row">';
					// 		html += '<div class="input-group">';
					// 			html += '<button type="button" name="SaveLSP" class="btn btn-success">';
					// 				html += '<i class="fas fa-save mr-1"></i>'+API.Contents.Language['Save'];
					// 			html += '</button>';
					// 			html += '<button type="button" name="GenerateStructure" class="btn btn-primary ml-2">';
					// 				html += '<i class="fas fa-cogs mr-1"></i>'+API.Contents.Language['Generate Structure'];
					// 			html += '</button>';
					// 			html += '<button type="button" name="GenerateSkeleton" class="btn btn-primary ml-2">';
					// 				html += '<i class="fas fa-cogs mr-1"></i>'+API.Contents.Language['Generate Skeleton'];
					// 			html += '</button>';
					// 			html += '<button type="button" name="GenerateSample" class="btn btn-primary ml-2">';
					// 				html += '<i class="fas fa-cogs mr-1"></i>'+API.Contents.Language['Generate Sample'];
					// 			html += '</button>';
					// 		html += '</div>';
					// 	html += '</div>';
					// 	content.html(html);
					// 	content.find('button').off().click(function(){
					// 		var btn = $(this).attr('name');
					// 		switch(btn){
					// 			case"SaveLSP":
					// 				var settings = {lsp:{}};
					// 				content.find('input').each(function(){
					// 					var key = $(this).attr('name');
					// 					settings.lsp[key] = content.find('input[name="'+key+'"]').val();
					// 				});
					// 				settings.customization = API.Contents.Settings.customization;
					// 				API.request('settings','save',{data:{settings:settings}});
					// 				break;
					// 			case"GenerateStructure":
					// 				API.request('lsp','generate',{data:{type:"structure"}});
					// 				break;
					// 			case"GenerateSkeleton":
					// 				API.request('lsp','generate',{data:{type:"skeleton"}});
					// 				break;
					// 			case"GenerateSample":
					// 				API.request('lsp','generate',{data:{type:"sample"}});
					// 				break;
					// 		}
					// 	});
					// });
					API.Plugins.settings.GUI.Tabs.add('developper',function(content, tab){
						var html = '', checked = '';
						console.log(settings);
						if(typeof settings.title === 'undefined'){ settings.title = ''; }
						if(typeof settings.registration === 'undefined'){ settings.registration = false; }
						if(typeof settings.forgot === 'undefined'){ settings.forgot = false; }
						html += '<h3>'+API.Contents.Language['Application Details']+'</h3>';
						html += '<div class="form-group row">';
							html += '<div class="input-group">';
								html += '<div class="input-group-prepend">';
									html += '<span class="input-group-text"><i class="fas fa-heading"></i></span>';
								html += '</div>';
								html += '<input type="text" class="form-control" name="title" placeholder="'+API.Contents.Language['Title']+'" value="'+settings.title+'">';
							html += '</div>';
						html += '</div>';
			      html += '<div class="form-group clearfix">';
			        html += '<div class="icheck-primary">';
								if(settings.registration){ checked = 'checked'; } else { checked = ''; }
			          html += '<input type="checkbox" id="registration" name="registration" '+checked+'>';
			          html += '<label for="registration">'+API.Contents.Language['Allow user registration']+'</label>';
			        html += '</div>';
			      html += '</div>';
			      html += '<div class="form-group clearfix">';
			        html += '<div class="icheck-primary">';
								if(settings.forgot){ checked = 'checked'; } else { checked = ''; }
			          html += '<input type="checkbox" id="forgot" name="forgot" '+checked+'>';
			          html += '<label for="forgot">'+API.Contents.Language['Allow user to reset their password from the login page']+'</label>';
			        html += '</div>';
			      html += '</div>';
						html += '<hr>';
						html += '<div class="form-group row">';
							html += '<div class="input-group">';
								html += '<button type="button" name="SaveApp" class="btn btn-success">';
									html += '<i class="fas fa-save mr-1"></i>'+API.Contents.Language['Save'];
								html += '</button>';
							html += '</div>';
						html += '</div>';
						html += '<h3>'+API.Contents.Language['Compile Application']+'</h3>';
						html += '<hr>';
						html += '<div class="form-group row">';
							html += '<div class="input-group">';
								html += '<button type="button" name="GenerateStructure" class="btn btn-primary ml-2">';
									html += '<i class="fas fa-cogs mr-1"></i>'+API.Contents.Language['Generate Structure'];
								html += '</button>';
								html += '<button type="button" name="GenerateSkeleton" class="btn btn-primary ml-2">';
									html += '<i class="fas fa-cogs mr-1"></i>'+API.Contents.Language['Generate Skeleton'];
								html += '</button>';
								html += '<button type="button" name="GenerateSample" class="btn btn-primary ml-2">';
									html += '<i class="fas fa-cogs mr-1"></i>'+API.Contents.Language['Generate Sample'];
								html += '</button>';
							html += '</div>';
						html += '</div>';
						content.html(html);
						content.find('button').off().click(function(){
							var btn = $(this).attr('name');
							switch(btn){
								case"SaveApp":
									var conf = {};
									content.find('input').each(function(){
										var key = $(this).attr('name');
										var type = $(this).attr('type');
										if(type == "checkbox"){
											settings[key] = content.find('input[name="'+key+'"]')[0].checked;
										} else {
											settings[key] = content.find('input[name="'+key+'"]').val();
										}
									});
									settings.customization = API.Contents.Settings.customization;
									API.request('settings','save',{data:{settings:conf}});
									break;
								case"GenerateStructure":
									API.request('lsp','generate',{data:{type:"structure"}});
									break;
								case"GenerateSkeleton":
									API.request('lsp','generate',{data:{type:"skeleton"}});
									break;
								case"GenerateSample":
									API.request('lsp','generate',{data:{type:"sample"}});
									break;
							}
						});
						// content.find('button').off().click(function(){
							var conf = {};
							content.find('input').each(function(){
								var key = $(this).attr('name');
								var type = $(this).attr('type');
								if(type == "checkbox"){
									conf[key] = content.find('input[name="'+key+'"]')[0].checked;
								} else {
									conf[key] = content.find('input[name="'+key+'"]').val();
								}
							});
							conf.customization = API.Contents.Settings.customization;
							API.request('settings','save',{data:{settings:conf}});
						// });
					});
					API.Plugins.settings.GUI.Tabs.add('customization',function(content, tab){
						var html = '', checked = '';
						if(!API.Helper.isSet(settings,['customization','pace','value'])){ settings.customization.pace.value = 'primary'; }
						if(!API.Helper.isSet(settings,['customization','logobg','value'])){ settings.customization.logobg.value = 'dark'; }
						if(!API.Helper.isSet(settings,['customization','nav','value'])){ settings.customization.nav.value = 'info'; }
						if(!API.Helper.isSet(settings,['customization','navmode','value'])){ settings.customization.navmode.value = 'dark'; }
						if(!API.Helper.isSet(settings,['customization','sidenav','value'])){ settings.customization.sidenav.value = 'info'; }
						if(!API.Helper.isSet(settings,['customization','sidenavmode','value'])){ settings.customization.sidenavmode.value = 'dark'; }
						html += '<h3>'+API.Contents.Language['Branding']+'</h3>';
						html += '<div class="row">';
							html += '<div class="col-md-6 py-2">';
								html += '<div class="input-group">';
			            html += '<div class="input-group-prepend">';
			              html += '<span class="input-group-text">';
			                html += '<i class="fas fa-copyright mr-2"></i>Brand';
			              html += '</span>';
			            html += '</div>';
									html += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Brand']+'" name="brand" value="'+settings.title+'">';
			          html += '</div>';
							html += '</div>';
							html += '<div class="col-md-6 py-2">';
								html += '<div class="input-group">';
			            html += '<div class="input-group-prepend">';
			              html += '<span class="input-group-text">';
			                html += '<i class="fas fa-file mr-2"></i>Logo';
			              html += '</span>';
			            html += '</div>';
									html += '<div class="custom-file pointer">';
										html += '<input type="file" class="custom-file-input pointer" name="logo" id="logo">';
										html += '<label class="custom-file-label pointer" for="logo"></label>';
									html += '</div>';
			            html += '<div class="input-group-append">';
			              html += '<a data-action="remove" class="btn btn-danger pointer">';
			                html += '<i class="fas fa-trash-alt mr-2"></i>Remove';
			              html += '</a>';
			            html += '</div>';
			          html += '</div>';
							html += '</div>';
						html += '</div>';
						html += '<h3>'+API.Contents.Language['Customization']+'</h3>';
						html += '<div class="row">';
							html += '<div class="col-md-6 py-2">';
								html += '<div class="input-group">';
			            html += '<div class="input-group-prepend">';
			              html += '<span class="input-group-text">';
			                html += '<i class="fas fa-paint-brush mr-2"></i>Pace';
			              html += '</span>';
			            html += '</div>';
			            html += '<select class="form-control" name="pace">';
										for(var [key, value] of Object.entries(["primary","secondary","info","success","warning","danger"])){
											if(settings.customization.pace.value == value){
												html += '<option value="'+value+'" selected>'+API.Helper.ucfirst(value)+'</option>';
											} else { html += '<option value="'+value+'">'+API.Helper.ucfirst(value)+'</option>'; }
										}
			            html += '</select>';
			          html += '</div>';
							html += '</div>';
							html += '<div class="col-md-6 py-2">';
								html += '<div class="input-group">';
			            html += '<div class="input-group-prepend">';
			              html += '<span class="input-group-text">';
			                html += '<i class="fas fa-moon mr-2"></i>Logo Background';
			              html += '</span>';
			            html += '</div>';
			            html += '<select class="form-control" name="logobg">';
										for(var [key, value] of Object.entries(["light","dark"])){
											if(settings.customization.logobg.value == value){
												html += '<option value="'+value+'" selected>'+API.Helper.ucfirst(value)+'</option>';
											} else { html += '<option value="'+value+'">'+API.Helper.ucfirst(value)+'</option>'; }
										}
			            html += '</select>';
			          html += '</div>';
							html += '</div>';
							html += '<div class="col-md-6 py-2">';
								html += '<div class="input-group">';
			            html += '<div class="input-group-prepend">';
			              html += '<span class="input-group-text">';
			                html += '<i class="fas fa-paint-brush mr-2"></i>Nav';
			              html += '</span>';
			            html += '</div>';
			            html += '<select class="form-control" name="nav">';
										for(var [key, value] of Object.entries(["primary","secondary","info","success","warning","danger"])){
											if(settings.customization.nav.value == value){
												html += '<option value="'+value+'" selected>'+API.Helper.ucfirst(value)+'</option>';
											} else { html += '<option value="'+value+'">'+API.Helper.ucfirst(value)+'</option>'; }
										}
			            html += '</select>';
			          html += '</div>';
							html += '</div>';
							html += '<div class="col-md-6 py-2">';
								html += '<div class="input-group">';
			            html += '<div class="input-group-prepend">';
			              html += '<span class="input-group-text">';
			                html += '<i class="fas fa-moon mr-2"></i>Nav Mode';
			              html += '</span>';
			            html += '</div>';
			            html += '<select class="form-control" name="navmode">';
										for(var [key, value] of Object.entries(["light","dark"])){
											if(settings.customization.navmode.value == value){
												html += '<option value="'+value+'" selected>'+API.Helper.ucfirst(value)+'</option>';
											} else { html += '<option value="'+value+'">'+API.Helper.ucfirst(value)+'</option>'; }
										}
			            html += '</select>';
			          html += '</div>';
							html += '</div>';
							html += '<div class="col-md-6 py-2">';
								html += '<div class="input-group">';
			            html += '<div class="input-group-prepend">';
			              html += '<span class="input-group-text">';
			                html += '<i class="fas fa-paint-brush mr-2"></i>Side Nav';
			              html += '</span>';
			            html += '</div>';
			            html += '<select class="form-control" name="sidenav">';
										for(var [key, value] of Object.entries(["primary","secondary","info","success","warning","danger"])){
											if(settings.customization.sidenav.value == value){
												html += '<option value="'+value+'" selected>'+API.Helper.ucfirst(value)+'</option>';
											} else { html += '<option value="'+value+'">'+API.Helper.ucfirst(value)+'</option>'; }
										}
			            html += '</select>';
			          html += '</div>';
							html += '</div>';
							html += '<div class="col-md-6 py-2">';
								html += '<div class="input-group">';
			            html += '<div class="input-group-prepend">';
			              html += '<span class="input-group-text">';
			                html += '<i class="fas fa-moon mr-2"></i>Side Nav Mode';
			              html += '</span>';
			            html += '</div>';
			            html += '<select class="form-control" name="sidenavmode">';
										for(var [key, value] of Object.entries(["light","dark"])){
											if(settings.customization.sidenavmode.value == value){
												html += '<option value="'+value+'" selected>'+API.Helper.ucfirst(value)+'</option>';
											} else { html += '<option value="'+value+'">'+API.Helper.ucfirst(value)+'</option>'; }
										}
			            html += '</select>';
			          html += '</div>';
							html += '</div>';
							html += '<div class="col-md-12 py-2">';
								html += '<hr>';
								html += '<div class="input-group">';
									html += '<button type="button" name="SaveApp" class="btn btn-success">';
										html += '<i class="fas fa-save mr-1"></i>'+API.Contents.Language['Save'];
									html += '</button>';
								html += '</div>';
							html += '</div>';
						html += '</div>';
						content.html(html);
						content.find('a[data-action="remove"]').off().click(function(){
							API.request('settings','removeLogo');
						});
						content.find('select').select2({ theme: 'bootstrap4' });
						content.find('button').off().click(function(){
							var run = true;
							var customization = {};
							customization = API.Contents.Settings.customization;
							content.find('select').each(function(){
								var key = $(this).attr('name');
								customization[key].value = $(this).select2('val');
								customization[key].type = API.Contents.Settings.customization[key].type;
							});
							content.find('input').each(function(){
								var key = $(this).attr('name');
								if(typeof customization[key] === "undefined"){ customization[key] = {}; }
								if(key != "logo"){
									customization[key].value = $(this).val();
									customization[key].type = API.Contents.Settings.customization[key].type;
								} else {
									if($(this).prop('files').length > 0){
										if($(this).prop('files')[0].type == "image/png"){
											customization[key].type = $(this).prop('files')[0].type;
											var fileReader = new FileReader();
									    fileReader.onload = function () {
									      customization[key].format = fileReader.result.split(',')[0];
									      customization[key].value = fileReader.result.split(',')[1];
									    };
									    fileReader.readAsDataURL($(this).prop('files')[0]);
										} else {
											run = false;
											alert("Logo must be PNG");
										}
									}
								}
							});
							if(run){
								API.request('settings','save',{data:{customization}},function(result){
									json = JSON.parse(result);
									if(json.success != undefined){
										var pace = $('body');
										var brand = $('a.brand-link');
										var navbar = $('nav.main-header.navbar');
										var sidebar = $('aside.main-sidebar');
										pace.removeClass(function (index, className) {
									    return (className.match (/\bpace-\S+/g) || []).join(' ');
										});
										brand.removeClass(function (index, className) {
									    return (className.match (/\bnavbar-\S+/g) || []).join(' ');
										});
										brand.removeClass(function (index, className) {
									    return (className.match (/\bbg-\S+/g) || []).join(' ');
										});
										navbar.removeClass(function (index, className) {
									    return (className.match (/\bnavbar-\S+/g) || []).join(' ');
										});
										sidebar.removeClass(function (index, className) {
									    return (className.match (/\bsidebar-\S+/g) || []).join(' ');
										});
										API.Contents.Settings.customization = json.output.settings.customization;
										settings = API.Contents.Settings;
										pace.addClass('pace-'+API.Contents.Settings.customization.pace.value);
										brand.addClass('navbar-'+API.Contents.Settings.customization.logobg.value);
										brand.addClass('bg-'+API.Contents.Settings.customization.logobg.value);
										navbar.addClass('navbar-expand');
										navbar.addClass('navbar-'+json.output.settings.customization.nav.value);
										navbar.addClass('navbar-'+json.output.settings.customization.navmode.value);
										sidebar.addClass('sidebar-'+API.Contents.Settings.customization.sidenavmode.value+'-'+API.Contents.Settings.customization.sidenav.value);
									}
								});
							}
						});
					});
				});
			},
			add:function(name, options = {}, callback = null){
				if(options instanceof Function){ callback = options; options = {}; }
				var tabs = $('#settingsTabs').find('.card-header').find('ul').first();
				var contents = $('#settingsTabs').find('.card-body').find('div.tab-content').first();
				tabs.append('<li class="nav-item"><a class="nav-link" data-toggle="pill" role="tab" id="settingsTabs-'+name.toLowerCase()+'" href="#settingsTabsContent-'+name.toLowerCase()+'" aria-controls="settingsTabsContent-'+name.toLowerCase()+'">'+API.Helper.ucfirst(name)+'</a></li>');
				tabs.find('a.nav-link').removeClass('active');
				tabs.find('a.nav-link').first().addClass('active');
				contents.append('<div class="tab-pane fade" id="settingsTabsContent-'+name.toLowerCase()+'" role="tabpanel" aria-labelledby="settingsTabs-'+name.toLowerCase()+'"></div>');
				contents.find('div.tab-pane').removeClass('show active');
				contents.find('div.tab-pane').first().addClass('show active');
				if(callback != null){ callback(contents.find('div.tab-pane').last(), tabs.find('li.nav-item').last()); }
			},
		}
	}
}

API.Plugins.settings.init();
