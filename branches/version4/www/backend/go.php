<?
// The source code packaged with this file is Free Software, Copyright (C) 2010 by
// Ricardo Galli <gallir at uib dot es>.
// It's licensed under the AFFERO GENERAL PUBLIC LICENSE unless stated otherwise.
// You can get copies of the licenses here:
//      http://www.affero.org/oagpl.html
// AFFERO GENERAL PUBLIC LICENSE is also included in the file called "COPYING".

include('../config.php');

$id = intval($_GET['id']);
if ($id > 0) {
		$l = $db->get_row("select link_url as url, link_ip as ip from links where link_id = $id");
		if ($l) {
			header('HTTP/1.1 301 Moved');
			header('Location: ' . $l->url);

			if (! $globals['bot'] 
				&& isset($_COOKIE['k']) && check_security_key($_COOKIE['k'])
				&& $l->ip != $globals['user_ip']
				&& ! id_visited($id)) {
				$db->query("INSERT INTO link_clicks (id, counter) VALUES ($id,1) ON DUPLICATE KEY UPDATE counter=counter+1");
			}
			exit(0);
		}
}
require(mnminclude.$globals['html_main']);
do_error(_('enlace inexistente'), 404);

function id_visited($id) {
	if (! isset($_COOKIE['v']) || ! ($visited = explode('x', $_COOKIE['v'])) ) {
		$visited = array();
		$found = false;
	} else {
		$found = array_search($id, $visited);
	}
	if (! $found) {
		array_push($visited, $id);
		if (count($visited) > 10) {
			array_shift($visited);
		}
		setcookie('v', implode('x', $visited));
	}
	return $found;
}
?>

