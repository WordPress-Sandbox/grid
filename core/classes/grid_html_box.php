<?php

class grid_html_box extends grid_box {
	
	public function type()
	{
		return 'html';
	}

	public function build($editmode) {
		if($editmode && empty($this->content->html))
		{
			return "Statischer HTML-Inhalt";
		}
		else
		{
			//boxes render their content in here
			return $this->content->html;
		}
	}
	
	public function isMetaType() {
		return TRUE;
	}
	
	public function metaTitle() {
		return "Statischer Inhalt";
	}
	
	public function metaSearchCriteria() {
		return array();
	}
	
	public function metaSearch($criteria,$query) {
		$this->content=new stdClass();
		$this->content->html="";
		return array($this);
	}
	
	public function contentStructure () {
		return array(
			array(
				'key'=>'html',
				'type'=>'html'
			)
		);
	}

}