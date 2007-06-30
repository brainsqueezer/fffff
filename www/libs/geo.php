<?
// The source code packaged with this file is Free Software, Copyright (C) 2007 by
// Ricardo Galli <gallir at uib dot es>.
// It's licensed under the AFFERO GENERAL PUBLIC LICENSE unless stated otherwise.
// You can get copies of the licenses here:
// 		http://www.affero.org/oagpl.html
// AFFERO GENERAL PUBLIC LICENSE is also included in the file called "COPYING".


function geo_latlng($type, $id) {
	global $db;

	if ($type == 'user') $table = 'geo_users';
	elseif ($type == 'link') $table = 'geo_links';
	else return false;

	return $db->get_row("SELECT X(geo_pt) as lat, Y(geo_pt) as lng, geo_text as text FROM  $table where geo_id=$id");
}

function geo_insert($type, $id, $lat, $lng, $text) {
	global $db;

	if ($type == 'user') $table = 'geo_users';
	elseif ($type == 'link') $table = 'geo_links';
	else return false;

	$id = (int) $id;
	$lat = (float) $lat;
	$lng = (float) $lng;
	$text = $db->escape($text);
	return $db->query("REPLACE INTO $table (geo_id, geo_text, geo_pt) VALUES ($id, '$text' , GeomFromText('POINT($lat $lng)'))");
}

function geo_delete($type, $id) {
	global $db;

	if ($type == 'user') $table = 'geo_users';
	elseif ($type == 'link') $table = 'geo_links';
	else return false;

	$id = (int) $id;
	return $db->query("DELETE FROM $table WHERE geo_id=$id");
}

function geo_init($f='geo_basic_load', $latlng = false) {
	global $globals;
	if (! $globals['google_maps_api']) return false;
	array_push($globals['extra_js'], 'http://maps.google.com/maps?file=api&amp;v=2.x&amp;key='.$globals['google_maps_api']);
	array_push($globals['extra_js'], 'geo.js');
	if ($latlng) 
		$globals['body_args'] = 'onload="'.$f.'('.$latlng->lat.','.$latlng->lng.')" onunload="GUnload()"';
	else
		$globals['body_args'] = 'onload="'.$f.'()" onunload="GUnload()"';
	return true;
}

function geo_coder_print_form($type, $id, $latlng, $label) {
	echo '<div id="genericform">';
	echo '<form action="#" name="geoform" onsubmit="return geo_show_address(this)">';
	echo '<label for="address">'.$label. '</label><br/>';
	echo '<input type="text" size="50" name="address" id="address" value="'.$latlng->text.'" />';
	echo '&nbsp;<input type="button" value="'._('buscar').'" class="genericsubmit" onclick="return geo_show_address(geoform);"/>';
	echo '&nbsp;<input type="button" id="geosave"  disabled="disabled"  value="'._('grabar').'" class="genericsubmit" onclick="return geo_save_current(\''.$type.'\', '.$id.', geoform)"/>';
	echo '&nbsp;<input type="button" id="geodelete" value="'._('borrar').'" class="genericsubmit" onclick="return geo_delete(\''.$type.'\', '.$id.', geoform)"/>';
	echo '<br/>&nbsp;&nbsp;<span class="genericformnote">'._('"ciudad, país" o "calle, ciudad, país"...').'</span>'."\n";
	echo '</form></div>';
}
