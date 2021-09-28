API.Plugins.settings = {
	element:{
		data:{},
	},
	init:function(){
		API.GUI.Sidebar.Nav.add('Settings', 'administration');
	},
	load:{
		index:function(){ API.Plugins.settings.GUI.Tabs.init(); },
	},
	GUI:{
		Tabs:{
			init:function(){
				API.request('settings','fetch',function(result){
					if(result.charAt(0) == '{'){
						API.Plugins.settings.element.data = JSON.parse(result);
						API.Plugins.settings.GUI.Tabs.add('overview',function(content, tab){
							var html = '';
							html += '<h3>'+API.Contents.Language['Security & Setup Warnings']+'</h3>';
							html += '<ul>';
							if(location.protocol !== 'https:'){ html += '<li>'+API.Contents.Language['HyperText Transfer Protocol Secure is currently not running.']+'</li>'; }
							if(API.Plugins.settings.element.data.extra.last_background_jobs.age){
								html += '<li>';
									html += API.Contents.Language['It has been']+' '+API.Plugins.settings.element.data.extra.last_background_jobs.time+' '+API.Contents.Language['since the last cron ran.']+'<br />';
									html += API.Contents.Language['Make sure to setup your CRON as followed']+': <code>* * * * * php '+API.Plugins.settings.element.data.extra.last_background_jobs.directory+'/cli.php --cron</code>';
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
									for(const [key, branch] of Object.entries(API.Plugins.settings.element.data.extra.lsp.branches)){
										if((!branch.includes("origin/HEAD"))&&(branch != '')){
											if(API.Plugins.settings.element.data.branch == branch.replace(/origin\//g, "").replace(/ /g, "")){
												html += '<option value="'+branch.replace(/origin\//g, "").replace(/ /g, "")+'" selected>'+API.Helper.ucfirst(branch.replace(/origin\//g, "").replace(/ /g, ""))+'</option>';
											} else { html += '<option value="'+branch.replace(/origin\//g, "").replace(/ /g, "")+'">'+API.Helper.ucfirst(branch.replace(/origin\//g, "").replace(/ /g, ""))+'</option>'; }
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
							if(API.Plugins.settings.element.data.extra.lsp.current){
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
							content.find('button').each(function(){
								$(this).click(function(){
									if($(this).attr('name') == "ChangeBranch"){
										var value = content.find('select').val();
										settings.customization = API.Contents.Settings.customization;
										API.request('settings','save',{data:{settings:{branch:value}}});
									}
									if($(this).attr('name') == "StartUpdate"){ API.request('settings','updateAPP'); }
								})
							});
						});
						API.Plugins.settings.GUI.Tabs.add('basic',function(content, tab){
							var html = '', checked = '';
							html += '<h3>'+API.Contents.Language['Background Jobs']+'</h3>';
							html += '<div class="form-group clearfix">';
			          html += '<div class="icheck-primary">';
									if(API.Plugins.settings.element.data.background_jobs == 'ajax'){ checked = 'checked'; } else { checked = ''; }
			            html += '<input type="radio" id="background_jobs1" value="ajax" name="background_jobs" '+checked+'>';
			            html += '<label for="background_jobs1">'+API.Contents.Language['AJAX']+'</label>';
			            html += '<p class="text-muted" style="margin-left:30px;">'+API.Contents.Language['Execute one task with each page loaded']+'</p>';
			          html += '</div>';
			          html += '<div class="icheck-primary">';
									if(API.Plugins.settings.element.data.background_jobs == 'webcron'){ checked = 'checked'; } else { checked = ''; }
			            html += '<input type="radio" id="background_jobs2" value="webcron" name="background_jobs" '+checked+'>';
			            html += '<label for="background_jobs2">'+API.Contents.Language['Webcron']+'</label>';
			            html += '<p class="text-muted" style="margin-left:30px;">'+API.Contents.Language['cron.php is registered at a webcron service to call cron.php every 5 minutes over HTTP.']+'</p>';
			          html += '</div>';
			          html += '<div class="icheck-primary">';
									if(API.Plugins.settings.element.data.background_jobs == 'cron'){ checked = 'checked'; } else { checked = ''; }
			            html += '<input type="radio" id="background_jobs3" value="cron" name="background_jobs" '+checked+'>';
			            html += '<label for="background_jobs3">'+API.Contents.Language['Cron']+'</label>';
			            html += '<p class="text-muted" style="margin-left:30px;">'+API.Contents.Language['Use system cron service to call the cron.php file every 5 minutes. The cron.php needs to be executed by the system user']+' "'+API.Plugins.settings.element.data.extra.whoami+'".</p>';
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
										for(var [key, language] of Object.entries(API.Plugins.settings.element.data.extra.languages)){
											if((language != ".")&&(language != "..")){
												language = language.replace(/.json/g, "");
												if(API.Plugins.settings.element.data.language == language){
													html += '<option value="'+language+'" selected>'+API.Helper.ucfirst(language)+'</option>';
												} else { html += '<option value="'+language+'">'+API.Helper.ucfirst(language)+'</option>'; }
											}
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
										for(const [key, timezone] of Object.entries(API.Plugins.settings.element.data.Timezones)){
											if(API.Plugins.settings.element.data.timezone == timezone){
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
										for(const [key, page] of Object.entries(API.Plugins.settings.element.data.extra.pages)){
											if(API.Plugins.settings.element.data.page == page){ html += '<option value="'+page+'" selected>'+API.Helper.ucfirst(page)+'</option>'; }
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
							content.find('button').click(function(){
								var settings = { background_jobs:content.find('input:checked').val() };
								content.find('select').each(function(){
									var key = $(this).attr('name');
									var value = $(this).select2('data')[0].id;
									settings[key] = value;
								});
								settings.customization = API.Contents.Settings.customization;
								API.request('settings','save',{data:{settings:settings}});
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
									if(API.Plugins.settings.element.data.debug){ checked = 'checked'; } else { checked = ''; }
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
									if(API.Plugins.settings.element.data.maintenance){ checked = 'checked'; } else { checked = ''; }
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
									if(API.Plugins.settings.element.data.developer){ checked = 'checked'; } else { checked = ''; }
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
								$(this).click(function(){
									var key = $(this).attr('name');
									var settings = {};
									settings[key] = content.find('input[name='+key+']')[0].checked;
									settings.customization = API.Contents.Settings.customization;
									API.request('settings','save',{data:{settings:settings}});
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
					        html += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Host']+'" name="host" value="'+API.Plugins.settings.element.data.sql.host+'">';
									html += '<div class="input-group-prepend">';
					          html += '<span class="input-group-text">';
					            html += '<i class="fas fa-database"></i>';
					          html += '</span>';
					        html += '</div>';
					        html += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Database']+'" name="database" value="'+API.Plugins.settings.element.data.sql.database+'">';
					      html += '</div>';
					    html += '</div>';
					    html += '<div class="form-group row">';
					      html += '<div class="input-group">';
					        html += '<div class="input-group-prepend">';
					          html += '<span class="input-group-text">';
					            html += '<i class="fas fa-user"></i>';
					          html += '</span>';
					        html += '</div>';
					        html += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Username']+'" name="username" value="'+API.Plugins.settings.element.data.sql.username+'">';
					        html += '<div class="input-group-prepend">';
					          html += '<span class="input-group-text">';
					            html += '<i class="fas fa-user-lock"></i>';
					          html += '</span>';
					        html += '</div>';
					        html += '<input type="password" class="form-control" placeholder="'+API.Contents.Language['Password']+'" name="password" value="'+API.Plugins.settings.element.data.sql.password+'">';
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
					        html += '<input type="number" class="form-control" name="SQLlimit" placeholder="'+API.Contents.Language['SQL Result Limit']+'" value="'+API.Plugins.settings.element.data.SQLlimit+'">';
					      html += '</div>';
					    html += '</div>';
					    html += '<div class="form-group row">';
					      html += '<div class="input-group">';
					        html += '<button type="button" name="SaveSQL" class="btn btn-success">';
					          html += '<i class="fas fa-save mr-1"></i>'+API.Contents.Language['Save'];
					        html += '</button>';
					      html += '</div>';
					    html += '</div>';
							html += '<hr>';
							html += '<h3>'+API.Contents.Language['Import/Export']+'</h3>';
							html += '<div class="form-group">';
								html += '<div class="vertical-input-group">';
									html += '<div class="input-group">';
					          html += '<div class="input-group-prepend">';
					            html += '<span class="input-group-text">';
					              html += '<i class="fas fa-file-import mr-2"></i>'+API.Contents.Language['Import'];
					            html += '</span>';
					          html += '</div>';
										html += '<div class="custom-file">';
					            html += '<input type="file" class="custom-file-input" name="dbFile" id="dbFile">';
					            html += '<label class="custom-file-label" for="dbFile">'+API.Contents.Language['Choose file']+'</label>';
					          html += '</div>';
									html += '</div>';
									html += '<div class="input-group">';
										html += '<div class="btn-group btn-block">';
											html += '<button type="button" name="ExportDB" class="btn btn-primary">';
												html += '<i class="fas fa-file-export mr-1"></i>'+API.Contents.Language['Export Database'];
											html += '</button>';
											html += '<button type="button" name="ImportDB" class="btn btn-success">';
												html += '<i class="fas fa-file-import mr-1"></i>'+API.Contents.Language['Import Database'];
											html += '</button>';
										html += '</div>';
									html += '</div>';
								html += '</div>';
							html += '</div>';
							content.html(html);
							content.find('button[name="SaveSQL"]').click(function(){
								var settings = {sql:{},SQLlimit:content.find('input[name="SQLlimit"]').val()};
								content.find('input').each(function(){
									var key = $(this).attr('name');
									if((key != "dbFile")&&(key != "SQLlimit")){ settings.sql[key] = content.find('input[name="'+key+'"]').val(); }
								});
								settings.customization = API.Contents.Settings.customization;
								API.request('settings','save',{data:{settings:settings}});
							});
						});
						API.Plugins.settings.GUI.Tabs.add('SMTP',function(content, tab){
							var html = '', checkSSL = '', checkSTARTTLS = '';
							if(typeof API.Plugins.settings.element.data.smtp === 'undefined'){
								API.Plugins.settings.element.data.smtp = { host:'', port:'', username:'', password:'', encryption:'' };
							}
							if(typeof API.Plugins.settings.element.data.smtp.host === 'undefined'){ API.Plugins.settings.element.data.smtp.host = ''; }
							if(typeof API.Plugins.settings.element.data.smtp.port === 'undefined'){ API.Plugins.settings.element.data.smtp.port = ''; }
							if(typeof API.Plugins.settings.element.data.smtp.username === 'undefined'){ API.Plugins.settings.element.data.smtp.username = ''; }
							if(typeof API.Plugins.settings.element.data.smtp.password === 'undefined'){ API.Plugins.settings.element.data.smtp.password = ''; }
							if(typeof API.Plugins.settings.element.data.smtp.encryption === 'undefined'){ API.Plugins.settings.element.data.smtp.encryption = ''; }
							if(API.Plugins.settings.element.data.smtp.encryption == 'SSL'){ checkSSL = 'selected' }
							if(API.Plugins.settings.element.data.smtp.encryption == 'STARTTLS'){ checkSTARTTLS = 'selected' }
							html += '<h3>'+API.Contents.Language['SMTP']+'</h3>';
							html += '<div class="form-group row">';
			          html += '<div class="input-group">';
			            html += '<div class="input-group-prepend">';
			              html += '<span class="input-group-text"><i class="fas fa-server"></i></span>';
			            html += '</div>';
			            html += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Host']+'" name="host" value="'+API.Plugins.settings.element.data.smtp.host+'">';
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
			            html += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Port']+'" name="port" value="'+API.Plugins.settings.element.data.smtp.port+'">';
			          html += '</div>';
			        html += '</div>';
							html += '<div class="form-group row">';
		            html += '<div class="input-group">';
	                html += '<div class="input-group-prepend">';
                    html += '<span class="input-group-text"><i class="fas fa-user"></i></span>';
	                html += '</div>';
	                html += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Username']+'" name="username" value="'+API.Plugins.settings.element.data.smtp.username+'">';
	                html += '<div class="input-group-prepend">';
                    html += '<span class="input-group-text"><i class="fas fa-user-lock"></i></span>';
	                html += '</div>';
	                html += '<input type="password" class="form-control" placeholder="'+API.Contents.Language['Password']+'" name="password" value="'+API.Plugins.settings.element.data.smtp.password+'">';
		            html += '</div>';
			        html += '</div>';
			        html += '<div class="form-group row">';
		            html += '<div class="input-group">';
	                html += '<button type="button" name="SaveSMTP" class="btn btn-success">';
                    html += '<i class="fas fa-save mr-1"></i>'+API.Contents.Language['Save'];
	                html += '</button>';
		            html += '</div>';
			        html += '</div>';
							content.html(html);
							content.find('button').click(function(){
								var settings = {smtp:{encryption:content.find('select').val()}};
								content.find('input').each(function(){
									var key = $(this).attr('name');
									settings.smtp[key] = content.find('input[name="'+key+'"]').val();
								});
								settings.customization = API.Contents.Settings.customization;
								API.request('settings','save',{data:{settings:settings}});
							});
						});
						API.Plugins.settings.GUI.Tabs.add('LDAP',function(content, tab){
							var html = '';
							if(typeof API.Plugins.settings.element.data.ldap === 'undefined'){
								API.Plugins.settings.element.data.ldap = { host:'', port:'', username:'', password:'', domain:'', base:'', branches:'' };
							}
							if(typeof API.Plugins.settings.element.data.ldap.host === 'undefined'){ API.Plugins.settings.element.data.ldap.host = ''; }
							if(typeof API.Plugins.settings.element.data.ldap.port === 'undefined'){ API.Plugins.settings.element.data.ldap.port = ''; }
							if(typeof API.Plugins.settings.element.data.ldap.username === 'undefined'){ API.Plugins.settings.element.data.ldap.username = ''; }
							if(typeof API.Plugins.settings.element.data.ldap.password === 'undefined'){ API.Plugins.settings.element.data.ldap.password = ''; }
							if(typeof API.Plugins.settings.element.data.ldap.domain === 'undefined'){ API.Plugins.settings.element.data.ldap.domain = ''; }
							if(typeof API.Plugins.settings.element.data.ldap.base === 'undefined'){ API.Plugins.settings.element.data.ldap.base = ''; }
							if(typeof API.Plugins.settings.element.data.ldap.branches === 'undefined'){ API.Plugins.settings.element.data.ldap.branches = ''; }
							html += '<h3>'+API.Contents.Language['LDAP Database']+'</h3>';
							html += '<div class="form-group row">';
		            html += '<div class="input-group">';
	                html += '<div class="input-group-prepend">';
                    html += '<span class="input-group-text"><i class="fas fa-server"></i></span>';
	                html += '</div>';
	                html += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Host']+'" name="host" value="'+API.Plugins.settings.element.data.ldap.host+'">';
	                html += '<div class="input-group-prepend">';
                    html += '<span class="input-group-text"><i class="fas fa-ethernet"></i></span>';
	                html += '</div>';
	                html += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Port']+'" name="port" value="'+API.Plugins.settings.element.data.ldap.port+'">';
		            html += '</div>';
			        html += '</div>';
							html += '<div class="form-group row">';
			          html += '<div class="input-group">';
			            html += '<div class="input-group-prepend">';
			              html += '<span class="input-group-text"><i class="fas fa-database"></i></span>';
			            html += '</div>';
			            html += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Domain']+'" name="domain" value="'+API.Plugins.settings.element.data.ldap.domain+'">';
			            html += '<div class="input-group-prepend">';
			              html += '<span class="input-group-text"><i class="fas fa-code-branch"></i></span>';
			            html += '</div>';
			            html += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Base DN']+'" name="base" value="'+API.Plugins.settings.element.data.ldap.base+'">';
			          html += '</div>';
			        html += '</div>';
							html += '<div class="form-group row">';
			          html += '<div class="input-group">';
			            html += '<div class="input-group-prepend">';
			              html += '<span class="input-group-text"><i class="fas fa-user"></i></span>';
			            html += '</div>';
			            html += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Username']+'" name="username" value="'+API.Plugins.settings.element.data.ldap.username+'">';
			            html += '<div class="input-group-prepend">';
			              html += '<span class="input-group-text"><i class="fas fa-user-lock"></i></span>';
			            html += '</div>';
			            html += '<input type="password" class="form-control" placeholder="'+API.Contents.Language['Password']+'" name="password" value="'+API.Plugins.settings.element.data.ldap.password+'">';
			          html += '</div>';
			        html += '</div>';
							html += '<div class="form-group row">';
			          html += '<div class="input-group">';
			            html += '<div class="input-group-prepend">';
			              html += '<span class="input-group-text"><i class="fas fa-code-branch"></i></span>';
			            html += '</div>';
									var branches = '';for(const [key, branch] of Object.entries(API.Plugins.settings.element.data.ldap.branches)){ branches += branch+"\n"; }
			            html += '<textarea class="form-control" rows="6" placeholder="'+API.Contents.Language['One LDAP branch per line...']+'" style="resize: none;" name="branches">'+branches+'</textarea>';
			          html += '</div>';
			        html += '</div>';
							html += '<div class="form-group row">';
			          html += '<div class="input-group">';
			            html += '<button type="button" name="SaveLDAP" class="btn btn-success">';
			              html += '<i class="fas fa-save mr-1"></i>'+API.Contents.Language['Save'];
			            html += '</button>';
			          html += '</div>';
			        html += '</div>';
							content.html(html);
							content.find('button').click(function(){
								var settings = {ldap:{branches:[]}};
								content.find('input').each(function(){
									var key = $(this).attr('name');
									settings.ldap[key] = content.find('input[name="'+key+'"]').val();
								});
								for(var [key, branch] of Object.entries(content.find('textarea').val().split("\n"))){ settings.ldap.branches.push(branch); }
								settings.customization = API.Contents.Settings.customization;
								API.request('settings','save',{data:{settings:settings}});
							});
						});
						API.Plugins.settings.GUI.Tabs.add('LSP',function(content, tab){
							var html = '';
							if(typeof API.Plugins.settings.element.data.lsp === 'undefined'){
								API.Plugins.settings.element.data.lsp = { host:'', application:'', token:'' };
							}
							if(typeof API.Plugins.settings.element.data.lsp.host === 'undefined'){ API.Plugins.settings.element.data.lsp.host = ''; }
							if(typeof API.Plugins.settings.element.data.lsp.application === 'undefined'){ API.Plugins.settings.element.data.lsp.application = ''; }
							if(typeof API.Plugins.settings.element.data.lsp.token === 'undefined'){ API.Plugins.settings.element.data.lsp.token = ''; }
							if(typeof API.Plugins.settings.element.data.license === 'undefined'){ API.Plugins.settings.element.data.license = ''; }
							html += '<h3>'+API.Contents.Language['Licensing Server']+'</h3>';
							html += '<div class="form-group row">';
								html += '<div class="input-group">';
									html += '<div class="input-group-prepend">';
										html += '<span class="input-group-text"><i class="fas fa-server"></i></span>';
									html += '</div>';
									html += '<input type="text" class="form-control" name="host" placeholder="'+API.Contents.Language['Host']+'" value="'+API.Plugins.settings.element.data.lsp.host+'">';
								html += '</div>';
							html += '</div>';
							html += '<div class="form-group row">';
								html += '<div class="input-group">';
									html += '<div class="input-group-prepend">';
										html += '<span class="input-group-text"><i class="fas fa-archive"></i></span>';
									html += '</div>';
									html += '<input type="text" class="form-control" name="application" placeholder="'+API.Contents.Language['Application']+'" value="'+API.Plugins.settings.element.data.lsp.application+'">';
								html += '</div>';
							html += '</div>';
							html += '<div class="form-group row">';
								html += '<div class="input-group">';
									html += '<div class="input-group-prepend">';
										html += '<span class="input-group-text"><i class="fas fa-ticket-alt"></i></span>';
									html += '</div>';
									html += '<input type="password" class="form-control" name="token" placeholder="'+API.Contents.Language['Token']+'" value="'+API.Plugins.settings.element.data.lsp.token+'">';
								html += '</div>';
							html += '</div>';
							html += '<hr>';
							html += '<div class="form-group row">';
								html += '<div class="input-group">';
									html += '<button type="button" name="SaveLSP" class="btn btn-success">';
										html += '<i class="fas fa-save mr-1"></i>'+API.Contents.Language['Save'];
									html += '</button>';
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
							content.find('button').click(function(){
								var btn = $(this).attr('name');
								switch(btn){
									case"SaveLSP":
										var settings = {lsp:{}};
										content.find('input').each(function(){
											var key = $(this).attr('name');
											settings.lsp[key] = content.find('input[name="'+key+'"]').val();
										});
										settings.customization = API.Contents.Settings.customization;
										API.request('settings','save',{data:{settings:settings}});
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
						});
						API.Plugins.settings.GUI.Tabs.add('developper',function(content, tab){
							var html = '', checked = '';
							if(typeof API.Plugins.settings.element.data.version === 'undefined'){ API.Plugins.settings.element.data.version = ''; }
							if(typeof API.Plugins.settings.element.data.title === 'undefined'){ API.Plugins.settings.element.data.title = ''; }
							if(typeof API.Plugins.settings.element.data.registration === 'undefined'){ API.Plugins.settings.element.data.registration = false; }
							if(typeof API.Plugins.settings.element.data.forgot === 'undefined'){ API.Plugins.settings.element.data.forgot = false; }
							html += '<h3>'+API.Contents.Language['Application Details']+'</h3>';
							html += '<div class="form-group row">';
								html += '<div class="input-group">';
									html += '<div class="input-group-prepend">';
										html += '<span class="input-group-text"><i class="fas fa-code-branch"></i></span>';
									html += '</div>';
									html += '<input type="text" class="form-control" name="version" placeholder="'+API.Contents.Language['Version']+'" value="'+API.Plugins.settings.element.data.version+'">';
								html += '</div>';
							html += '</div>';
							html += '<div class="form-group row">';
								html += '<div class="input-group">';
									html += '<div class="input-group-prepend">';
										html += '<span class="input-group-text"><i class="fas fa-heading"></i></span>';
									html += '</div>';
									html += '<input type="text" class="form-control" name="title" placeholder="'+API.Contents.Language['Title']+'" value="'+API.Plugins.settings.element.data.title+'">';
								html += '</div>';
							html += '</div>';
				      html += '<div class="form-group clearfix">';
				        html += '<div class="icheck-primary">';
									if(API.Plugins.settings.element.data.registration){ checked = 'checked'; } else { checked = ''; }
				          html += '<input type="checkbox" id="registration" name="registration" '+checked+'>';
				          html += '<label for="registration">'+API.Contents.Language['Allow user registration']+'</label>';
				        html += '</div>';
				      html += '</div>';
				      html += '<div class="form-group clearfix">';
				        html += '<div class="icheck-primary">';
									if(API.Plugins.settings.element.data.forgot){ checked = 'checked'; } else { checked = ''; }
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
							content.html(html);
							content.find('button').click(function(){
								var settings = {};
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
								API.request('settings','save',{data:{settings:settings}});
							});
						});
						API.Plugins.settings.GUI.Tabs.add('customization',function(content, tab){
							var html = '', checked = '';
							if(API.Helper.isSet(API.Plugins.settings.element.data,['customization','pace','value'])){ API.Plugins.settings.element.data.customization.pace.value = 'primary'; }
							if(API.Helper.isSet(API.Plugins.settings.element.data,['customization','logobg','value'])){ API.Plugins.settings.element.data.customization.logobg.value = 'dark'; }
							if(API.Helper.isSet(API.Plugins.settings.element.data,['customization','nav','value'])){ API.Plugins.settings.element.data.customization.nav.value = 'warning'; }
							if(API.Helper.isSet(API.Plugins.settings.element.data,['customization','navmode','value'])){ API.Plugins.settings.element.data.customization.navmode.value = 'light'; }
							if(API.Helper.isSet(API.Plugins.settings.element.data,['customization','sidenav','value'])){ API.Plugins.settings.element.data.customization.sidenav.value = 'primary'; }
							if(API.Helper.isSet(API.Plugins.settings.element.data,['customization','sidenavmode','value'])){ API.Plugins.settings.element.data.customization.sidenavmode.value = 'light'; }
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
												if(API.Plugins.settings.element.data.customization.pace.value == value){
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
												if(API.Plugins.settings.element.data.customization.logobg.value == value){
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
												if(API.Plugins.settings.element.data.customization.nav.value == value){
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
												if(API.Plugins.settings.element.data.customization.navmode.value == value){
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
												if(API.Plugins.settings.element.data.customization.sidenav.value == value){
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
												if(API.Plugins.settings.element.data.customization.sidenavmode.value == value){
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
							content.find('select').select2({ theme: 'bootstrap4' });
							content.find('button').click(function(){
								var settings = {};
								settings.customization = API.Contents.Settings.customization;
								content.find('select').each(function(){
									var key = $(this).attr('name');
									settings.customization[key].value = $(this).select2('val');
									settings.customization[key].type = API.Contents.Settings.customization[key].type;
								});
								content.find('input').each(function(){
									var key = $(this).attr('name');
									settings.customization[key].value = $(this).val();
									settings.customization[key].type = API.Contents.Settings.customization[key].type;
								});
								API.request('settings','save',{data:{settings:settings}});
							});
						});
					}
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
