<?php
	$bdd=new PDO('mysql:host=localhost;dbname=infirmerie;charset=utf8','root','',array(PDO::ATTR_ERRMODE=> PDO::ERRMODE_EXCEPTION));
	$pass="";
	$user="";
			if (isset($_POST['username']) AND isset($_POST['password'])) {
				$username=$_POST['username'];
				$password=$_POST['password'];
				if ($username==$user and $password==$pass) {
					header("Location:admin-panel.php");
				}else{
					$erreur="Mauvais identifiant";
				}

			}else{
				$erreur="tous les champs doivent etre remplie!";
			}
		

?>
<!DOCTYPE html>
<html>
<head>
<link re="stylesheet" type="text/css" href="button.css">		
    <link href="dist/css/bootstrap.min.css" rel="stylesheet">
	 <link rel="stylesheet" type="text/css" href="css/style.css">
<link rel="stylesheet" type="text/css" href="tutoriel.css">
	 <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
<!-- Main CSS-->

<link rel="stylesheet" type="text/css" href="css/main.css">
<!-- Font-icon css-->
<link rel="stylesheet" type="text/css" href="css/font-awesome.min.css">
<link rel="shortcut icon" href="images/4.png" type="images/png"/>
</head>
<style type="text/css">
	#ab1:hover{cursor:pointer;}
</style>
<body style="background:url('images/4.png') no-repeat; background-size: cover;">
<div class="container"  style="width: 400px;margin-top:100px;">
 <div class="card bg-primary"><center>
 <img src="images/11.png" class="card-img-top" >
 <span class="icon-user" style="color:white;">Authentification</style></span><br><br>
<form class="textbox" action="" method="post"> 
	<input type="text" name="username"  placeholder=" login"class="form-control" >
	<label style="color:white;">Password :</label>
	<input type="password" name="password" class="form-control" placeholder=" password" >
	<br/>
	<?php
		if(isset($erreur)){
			echo "<p style='color:red;'>".$erreur."</p>";					}
	?>
	</div>

	<br/><center><button type="submit" name="login_submit"  id= "ab1" class= "btn btn-primary" ><span class="icon-login">Se connecter</span>&nbsp&nbsp&nbsp&nbsp</button></center><br/>
	<center>
	<a href="inscription.php"> 
	<button type="button" value="Creer un compte" name="creer un compte" class="btn btn-primary"><span class="icon-user">Creer un compte</span>&nbsp&nbsp&nbsp&nbsp</button></a></center>

</form>
<br/>
</div>
</div>
</div>
</center>
</div>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>


</body>
</html>