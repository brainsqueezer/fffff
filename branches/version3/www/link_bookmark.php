<?
include('config.php');

$user_id = intval($_GET['user_id']);
$option = $_GET['option'];

switch ($option) {
	case 'shaken':
		$sql = "SELECT link_id FROM links, votes WHERE vote_type='links' and vote_user_id=$user_id AND vote_link_id=link_id  and vote_value > 0 ORDER BY link_id DESC LIMIT 1000";
		do_header(_('votadas'));
		do_link_item($sql);
		do_footer();
		break;
	case 'favorites':
		$sql = "SELECT link_id FROM links, favorites WHERE favorite_user_id=$user_id AND favorite_type='link' AND favorite_link_id=link_id  ORDER BY link_id DESC LIMIT 1000";
		do_header(_('favoritos'));
		do_link_item($sql);
		do_footer();
		break;
	case 'commented':
		$sql = "SELECT distinct(link_id) FROM links, comments WHERE comment_user_id=$user_id and link_id=comment_link_id and comment_type != 'admin' ORDER BY link_id DESC LIMIT 1000";
		do_header(_('comentadas'));
		do_link_item($sql);
		do_footer();
		break;
	case 'history':
		$sql = "SELECT link_id FROM links WHERE link_author=$user_id ORDER BY link_id DESC LIMIT 1000";
		do_header(_('envíadas'));
		do_link_item($sql);
		do_footer();
		break;
	default:
		die;
}

function do_header($title) {
	echo '<!DOCTYPE NETSCAPE-Bookmark-file-1>' . "\n";
	echo '<!-- This file was generated by Meneame -->' . "\n";
	echo '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">' . "\n";
	echo '<TITLE>Bookmarks</TITLE>' . "\n";
	echo '<H1 LAST_MODIFIED="'.time().'">Bookmarks</H1>' . "\n";
	echo '<DL><P>' . "\n";
	echo '<DT><H3 FOLDED >'.$title.'//'.get_server_name().'</H3>' . "\n";
	echo '<DL><P>' . "\n";
}

function do_footer() {
	echo '</DL>' . "\n";
}

function do_link_item($sql) {
	global $db;

	$link = new Link;
	$links = $db->get_col($sql);
	if ($links) {
		foreach($links as $link_id) {
			$link->id=$link_id;
			$link->read();
			if ($_REQUEST['url'] == 'source') {
				$url = htmlentities($link->url);
			} else {
				$url = $link->get_permalink();
			}
			echo '<DT><A HREF="'.$url.'" REL="nofollow">'.$link->title.'</A>' . "\n";
		}
	}
}

?>
