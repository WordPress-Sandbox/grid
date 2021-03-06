<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */

class grid_reuse_container_editor
{
	public function getCSS($absolute=FALSE)
	{
		$lib=new grid_library();
		return $lib->getEditorCSS($absolute);
	}
	
	public function getJS($language="en",$absolute=FALSE)
	{
		$lib=new grid_library();
		return $lib->getEditorJS($language,$absolute);
	}
	
	public function run($grid_db,$editorlinkfunction,$deletelinkfunction)
	{
		$containerIds=$grid_db->getReuseContainerIds();
		$usedIds=$grid_db->getReusedContainerIds();
		
		$grid=new grid_grid();
		$grid->storage=$grid_db;
		$grid->container=array();
		foreach($containerIds as $id)
		{
			/**
			 * load container from reuse container
			 */
			$container=$grid_db->loadReuseContainer($id);
			$container->grid=$grid;
			$container->classes[] = "grid-container-factory-preview";


			$edit=new grid_container();
			$edit->grid=$grid;
			$edit->storage=$grid_db;
			$edit->type="c-1d1";
			$edit->readmore="edit";
			$edit->slots=array();
			$edit->prolog=$container->reusetitle;
			$edit->readmoreurl=$editorlinkfunction($id);
			$edit->classes[] = "grid-container-factory-edit";
			if(!in_array($id, $usedIds))
			{
				$edit->epilog="<a href=\"".$deletelinkfunction($id)."\">delete</a>";
			}

			/**
			 * place to grid
			 * 1. reuse container with edit and container title
			 * 2. the original container to preview contents
			 */
			$grid->container[]=$container;
			$grid->container[]=$edit;
		}
		return $grid->render(TRUE);
	}
	
	public function runEditor($grid_db,$id,$ckeditor,$ajax,$debugmode,$preview)
	{
		$grid_lib=new grid_library();
		return $grid_lib->getEditorHTML(
							"\"container:".$id."\"",
							"container",
							$ckeditor,
							$ajax,
							$debugmode,
							$preview,
							'');
	}
	
	public function runDelete($grid_db,$id)
	{
		if(isset($_POST) && !empty($_POST) && $_POST['grid_delete_id']==$id)
		{
			$grid_db->deleteReusableContainer($id);
			return TRUE;
		}
		ob_start();
?>
<form method="post">
<input type="hidden" name="grid_delete_id" value="<?php echo $id;?>">
<input type="submit" class="form-submit" value="Delete Container">
</form>
<?php
		$result=ob_get_contents();
		ob_end_clean();
		return $result;
	}
}