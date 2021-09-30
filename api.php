<?php
class settingsAPI extends APIextend {

	public function fetch(){
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
			],
		];
		// $config = $this->Settings;
		// // Langing Pages
		// $pages = [];
		// $plugins = scandir(dirname(__FILE__,3).'/plugins/'); foreach($plugins as $plugin) {
		// 	if(("$plugin" != "..") and ("$plugin" != ".")){ $file = dirname(__FILE__,3)."/plugins/".$plugin."/src/views/index.php";
		// 		if(is_file($file)){ array_push($pages,$plugin); }
		// 	}
		// }
		// // Adding Extras
		// $config['extra'] = [
		// 	'last_background_jobs' => [
		// 		'time' => $this->getTimeDiff($this->Settings["last_background_jobs"],date("Y-m-d H:i:s")),
		// 		'directory' => dirname(__FILE__,3),
		// 		'age' => $isJobOld,
		// 	],
		// 	'lsp' => [
		// 		'branches' => explode("\n",shell_exec("git branch -r")),
		// 		'current' => $this->LSP->Update,
		// 	],
		// 	'whoami' => exec('whoami'),
		// 	'languages' => scandir(dirname(__FILE__,3).'/dist/languages/'),
		// 	'pages' => $pages,
		// ];
		// return $config;
	}

	public function save($request, $data){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			return $this->SaveCfg($data['settings']);
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
