<?php
class settingsAPI extends API {

	public function fetch($request, $data){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			// Last Background Job
			$datetime1 = new DateTime($this->Settings["last_background_jobs"]);
			$datetime2 = new DateTime(date("Y-m-d H:i:s"));
			$interval = date_diff($datetime1, $datetime2);
			$isJobOld = false;
			if($interval->format('%Y') > 0){ $isJobOld = true; }
			elseif($interval->format('%m') > 0){ $isJobOld = true; }
			elseif($interval->format('%d') > 0){ $isJobOld = true; }
			elseif($interval->format('%H') > 0){ $isJobOld = true; }
			elseif($interval->format('%i') > 5){ $isJobOld = true; }

			// Fetch Manifest
	    $curl = curl_init();
	    curl_setopt($curl, CURLOPT_URL, $this->Settings['repository']['host']['raw'].$this->Settings['repository']['name'].'/'.$this->Settings['repository']['branch'].$this->Settings['repository']['manifest']);
	    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	    $manifest = json_decode(curl_exec($curl), true);
	    curl_close($curl);

			// Fetch Languages
			$languages = scandir(dirname(__FILE__,3).'/dist/languages/');
			foreach($languages as $key => $language){ if(!is_file(dirname(__FILE__,3).'/dist/languages/'.$language)){ unset($languages[$key]); } else { $languages[$key] = str_replace('.json','',$language); } }

			// Fetch Plugins
			foreach($this->Plugins as $plugin => $conf){ if(is_file(dirname(__FILE__,3).'/plugins/'.$plugin.'/src/views/index.php')){ $pages[] = $plugin; } }

			// Return
			return [
				"success" => $this->Language->Field["This request was successfull"],
				"request" => $request,
				"data" => $data,
				"output" => [
					'settings' => $this->Settings,
					'cron' => [
						'status' => $isJobOld,
						'age' => $this->getTimeDiff($this->Settings["last_background_jobs"],date("Y-m-d H:i:s")),
					],
					'directory' => dirname(__FILE__,3),
					"manifest" => $manifest,
					'languages' => $languages,
					'timezones' => $this->Timezones,
					'pages' => $pages,
				],
			];
		}
	}

	public function removeLogo($request, $data){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			echo "executor";
			if(unlink(dirname(__FILE__,3).'/dist/img/custom-logo.png')){
				return [
					"success" => $this->Language->Field["Custom logo was removed"],
					"request" => $request,
					"data" => $data,
				];
			} else {
				return [
					"error" => $this->Language->Field["Unable to remove the custom logo"],
					"request" => $request,
					"data" => $data,
				];
			}
		}
	}

	public function save($request, $data){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			if(isset($data['customization']['brand']['value'])){ $data['title'] = $data['customization']['brand']['value']; unset($data['customization']['brand']); }
			if(isset($data['customization']['logo']['value'])){
				$logo = fopen(dirname(__FILE__,3).'/dist/img/custom-logo.png', 'w');
				fwrite($logo, base64_decode($data['customization']['logo']['value']));
				fclose($logo);
				unset($data['customization']['logo']);
			}
			$this->Settings = $this->SaveCfg($data);
			return [
				"success" => $this->Language->Field["Settings Saved"],
				"request" => $request,
				"data" => $data,
				"output" => [
					'settings' => $this->Settings,
				],
			];
		}
	}

	public function send($request, $data){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			if(isset($this->Settings['smtp'],$this->Settings['smtp']['username'],$this->Settings['smtp']['password'],$this->Settings['smtp']['host'],$this->Settings['smtp']['port'],$this->Settings['smtp']['encryption'])){
				return [
					"success" => $this->Language->Field["Email sent!"],
					"request" => $request,
					"data" => $data,
					"output" => [
						'smtp' => $this->Auth->Mail->send($this->Auth->User['email'],"If you are receiving this message, your SMTP settings are working.",['extra' => ['subject' => $this->Settings['title']." - SMTP Test Email"]]),
					],
				];
			} else {
				return [
					"error" => $this->Language->Field["SMTP Server not configured"],
					"request" => $request,
					"data" => $data,
				];
			}
		}
	}

	public function update($request, $data){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			$data['silent']=true;
			return $this->__update($data);
		}
	}
}
