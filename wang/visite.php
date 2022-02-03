<?php

	$bdd=new PDO('mysql:host=localhost;dbname=infirmerie;charset=utf8','root','',array(PDO::ATTR_ERRMODE=> PDO::ERRMODE_EXCEPTION));

		if (isset($_POST['forminscription'])) {
			$nom=htmlspecialchars($_POST['nom']);
			$prenom=htmlspecialchars($_POST['prenom']);
			$age=htmlspecialchars($_POST['age']);
			$plainte=htmlspecialchars($_POST['plainte']);
			$contact=htmlspecialchars($_POST['contact']);
			$maux=htmlspecialchars($_POST['maux']);
			$filiere=htmlspecialchars($_POST['filiere']);
			$dates=$_POST['date'];
			$heures=$_POST['heure'];
			$sexe=$_POST['sexe'];

			if(!empty($_POST['nom']) AND !empty($_POST['prenom']) AND !empty($_POST['age']) AND !empty($_POST['plainte']) AND !empty($_POST['contact']) AND !empty($_POST['maux']) AND !empty($_POST['filiere'])){
				
					$pseudolength=strlen($nom);
					if($pseudolength<=255){
										$insertmbr=$bdd->prepare("INSERT INTO patient(nom,prenom,plainte,maux,contact,age,filiere,dates,heures,sexe) VALUES(?,?,?,?,?,?,?,?,?,?)");
										$insertmbr->execute(array($nom,$prenom,$plainte,$maux,$contact,$age,$filiere,$dates,$heures,$sexe));
										$erreur="Votre compte a bien été créer";
										//header('location:Login_v2/Login_v2/login.php');
					}else{
						$erreur="Votre pseudo ne doit pas depasser 255 caracteres";
						}
			}else{
				$erreur="Tous les champs doivent etre remplis!";
				}
		}

?>
<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" type="text/css" href="style.css">
<link rel="stylesheet" type="text/css" href="tutoriel.css">
	 <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
	 	
<div class="card">
<link rel="stylesheet" type="text/css" href="css/main.css">
<!-- Font-icon css-->
<link rel="stylesheet" type="text/css" href="css/font-awesome.min.css">

    <link href="dist/css/bootstrap.min.css" rel="stylesheet">
	 <link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<body>
<!-- <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
  <a class="navbar-brand" href="#">HMS<style=" right:55px;"/></a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="true" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="#"> <span class=""></span>  <span class="sr-only">(current)</span></a> 
	 </li>
      <li class="nav-item">
        <a class="nav-link" href="message.html"> <span class=""></span> Medical report</a>
      </li>
    </ul>
	<div class="row">
      <input class="form-control mb-2 mr-sm-2 mb-sm-0" type="search" name="search" placeholder="Enter contact" aria-label="Search"></div>
      <button class="btn btn-success my-2 my-sm-0" type="submit" name="search_patient_submit"><span class="icon-search"> </button>
    &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp 
    <div class="panel bg-light" style="padding: 5px;">
  <a href="#" class="btn btn-outline-success my-2 my-sm-0" role="button" aria-pressed="true">
<span class=" icon-cog-1">
Setting</a> &nbsp&nbsp &nbsp&nbsp 
		    <a href="#" class="btn btn-outline-success my-2 my-sm-0" role="button" aria-pressed="true">Help<span class="icon-help-circled"></a>&nbsp&nbsp&nbsp
	<a href="admin-panel.php"> 
	<button type="submit" class="btn btn-outline-success my-2 my-sm-0" role="button" aria-pressed="true">Home<span class="icon-home"></button></a>

  </div>
  </div>

</nav> -->

 <div class="sidebar_menu " >
  <center>
      <a href="#">
        <h1 class="boxed_item">
          <a class="nav-link" href="#">  
           <center> <img src="images/save.png" height="140px" width="200px" /></a></center><br/><br/>
        </h1>
      </a>
      <h2 class="logo_title bg-success" style="font-weight: bold;">&nbsp&nbsp&nbsp APPOINTMENT</h2>
    </center>
<center>
</div>
<div class="jumbotron" style="background:url('images/6.jpg') no-repeat;background-size:cover;height:300px;"></div>
<div class="container-fluid">
<div class="row">
	<div class="col-md-3">
		<div class="list-group">
			<ul class="navigation_section">
      		<li class="navigation_item" id="profile">
        
      <center>
        <a href="admin-panel.php"> 
        <h1 class="boxed_item boxed_item_smaller signup">
        <span class=""> </span>Accueil</h1></a>
      </center>
      </li>
      <center>
      <center>
        <a href="details-rendez_vous.php"> 
        <h1 class="boxed_item boxed_item_smaller signup">
        <span class=""> </span> Listes des Etudiants</h1></a>
      </center>
      <center>
      </li>
		</div>
		</div>
	<div class="col-md-8">
	<div class="card">
		<div class="card-body" style="background-color:#3E4444; color:#ffffff;">
		<center> Visite M&eacutedical</center>
		</div>
		<div>
		<div class="card-body">
			<form  action="" method="POST">
			<div class="field">
				<span class="icon-user-1"><input type="text" id="name" name="nom"  placeholder="Nom de l'etudiant"   required>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspDate de visite :<br/> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span class=" icon-calendar-1"></span> <input type="date" id="date" name="date"  size="10px">
<span class=" icon-back-in-time"></span><input type="time" id="time" name="heure" size="10px"><br/><br/> </span></div>
<div class="field">
	<span class="icon-user-1"><input type="text" id="name" name="prenom"  placeholder="Prenom de l'etudiant"   required>
					
				&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span class="icon-adjust"><input type="text" name="Maux" id="orderr" placeholder="Maux"  required>
				
	<div class="field">
				<span class=" icon-book-2"><input type="text" name="filiere" id="examen"  placeholder="filiere"  required>
				
				&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span class=" icon-news"><input type="text" name="Plainte" placeholder="PLAINTE" id="cas" required>
	</div>
			<div class="field">
				<span class="icon-call"><input type="text" name="contact" id="contact" placeholder="Contact" required>
				
				&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span class="icon-person"><input type="text" name="age" id="age" placeholder="Age" required><br/>
				</div>
				<div class="field">
		<br/>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</div>			<center><label>Sexe :</label>
					<input type="radio" name="sexe" id="sexe" value="Feminin"/>Feminin &nbsp&nbsp&nbsp <input type="radio" id="sexe" name="sexe" value="Masculin"/>Masculin<br/></div></center>
					<input type="submit" name="forminscription" />
					</center>
	
				
						
			</form>

		
		</div>
	
	</div>
	
		</div>
	
	</div>
	
	<div class="col-md-1"></div>

</div>

</div>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>


<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/6.10.1/sweetalert2.all.min.js"></script>
</body>
</html>

