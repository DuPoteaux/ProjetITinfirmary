<?php
$bdd=new PDO('mysql:host=localhost;dbname=infirmerie;charset=utf8','root','',array(PDO::ATTR_ERRMODE=> PDO::ERRMODE_EXCEPTION));
if(isset($_GET['sup'])){
	$id=$_GET['sup'];
  	$requete=$bdd->exec("DELETE FROM etudiant WHERE id='$id'");	
  	echo "<script>alert('données supprimer');</script>";
  	header("location:details-rendez_vous.php");
}
?>