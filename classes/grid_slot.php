<?php

class grid_slot extends grid_base {
	public $grid;
	public $slotid;
	public $style;
	public $classes = array();
	public $boxes;
	public $dimension;

	public function __construct()
	{
		$this->boxes=array();
	}	

	public function render($editmode, $container)
	{
		$boxes=array();
		if(count($this->boxes)>0)
		{
			$this->boxes[0]->classes[]="box-first";
			$this->boxes[count($this->boxes)-1]->classes[]="box-last";
		}

		foreach($this->boxes as $box)
		{
			$boxes[]=$box->render($editmode);
		}

		ob_start();
		if($this->storage->templatesPath!=NULL && file_exists($this->storage->templatesPath.'/grid_slot.tpl.php'))
			include $this->storage->templatesPath.'/grid_slot.tpl.php';
		else
			include dirname(__FILE__).'/../templates/frontend/grid_slot.tpl.php';
		$output=ob_get_clean();
		return $output;
	}
	
	public function addBox($idx,$box)
	{
		$list=$this->boxes;
		array_splice($list, $idx,0,array($box));
		$this->boxes=$list;
		$this->storage->storeSlotOrder($this);
		return true;		
	}
	
	public function removeBox($idx)
	{
		$list=$this->boxes;
		array_splice($list, $idx,1);
		$this->boxes=$list;
		$this->storage->storeSlotOrder($this);
		return true;
	}
	
	public function setStyle($style)
	{
		$this->style=$style;
		return $this->storage->persistSlot($this);
	}
}