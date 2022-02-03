		<?php 
		 $id=$_GET['sup'];

	 $bdd=new PDO('mysql:host=localhost;dbname=infirmerie;charset=utf8','root','',array(PDO::ATTR_ERRMODE=> PDO::ERRMODE_EXCEPTION));

  $requete=$bdd->query("SELECT * FROM etudiant WHERE id='$id'");  
?>
            <?php
            
    while($information=$requete->fetch()) 
             {

            $nom=$information['nom'];
            $prenom=$information['prenom'];
            $date=$information['dates'];
            $heure=$information['heures'];
            $Maux=$information['Maux'];
            $filiere=$information['filiere'];
            $plainte=$information['plainte'];
            $contact=$information['contact'];
            $age=$information['age'];
            $sexe=$information['sexe'];
        }
?>
<html>
<head>
<link rel="stylesheet" type="text/css" href="style.css">
<link rel="stylesheet" type="text/css" href="tutoriel.css">
	 <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
	 	
<!-- Main CSS-->
<div class="card">
<link rel="stylesheet" type="text/css" href="css/main.css">
<!-- Font-icon css-->
<link rel="stylesheet" type="text/css" href="css/font-awesome.min.css">

    <link href="dist/css/bootstrap.min.css" rel="stylesheet">
	 <link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<body>
<nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
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
    <form class="form-inline my-2 my-lg-0" action="" method="post"><div class="row">
      <input class="form-control mb-2 mr-sm-2 mb-sm-0" type="search" name="search" placeholder="Enter contact" aria-label="Search"></div>
      <button class="btn btn-success my-2 my-sm-0" type="submit" name="search-rendez-vous"><span class="icon-search"> </button>
    </form>
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

</nav>

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
      </li>
      </li>
		</div>
		</div>
	<div class="col-md-8">
	<div class="card">

		<div class="card-body" style="background-color:#3E4444; color:#ffffff;">	
		<center>Rendez-Vous</center>
		</div>
		<div>
		<div class="card-body">
      <form  action="" method="POST">
      <div class="field">
        <span class="icon-user-1"><input type="text" id="name" name="nom"  placeholder="Nom de l'etudiant" value="<?php  echo $nom; ?>"   required>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspDate de visite :<br/> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span class=" icon-calendar-1"></span> <input type="date" id="date" value="<?php  echo $date; ?>" name="date"  size="10px">
<span class=" icon-back-in-time"></span><input type="time" id="time" value="<?php  echo $heure; ?>" name="heure" size="10px"><br/><br/> </span></div>
<div class="field">
  <span class="icon-user-1"><input type="text" id="name" name="prenom" value="<?php  echo $prenom; ?>"  placeholder="Prenom de l'etudiant"   required>
          
        &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span class="icon-adjust"><input type="text" name="Maux" value="<?php  echo $Maux; ?>" id="orderr" placeholder="Maux"  required>
        
  <div class="field">
        <span class=" icon-book-2"><input type="text" name="profession" value="<?php  echo $filiere; ?>" id="examen"  placeholder="filiere"  required>
        
        &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span class=" icon-news"><input type="text" name="plainte" value="<?php  echo $plainte; ?>" placeholder="PLAINTE" id="cas" required>
  </div>
      <div class="field">
        <span class="icon-call"><input type="text" name="contact" value="<?php  echo $contact; ?>" id="contact" placeholder="Contact" required>
        
        &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span class="icon-person"><input type="text" name="age" value="<?php  echo $age; ?>" id="age" placeholder="Age" required><br/>
        </div>
        <div class="field">
    <br/>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</div>      <center><label>Sexe :</label>
          <input type="radio" name="sexe" id="sexe" value="Feminin"/>Feminin &nbsp&nbsp&nbsp <input type="radio" id="sexe" name="sexe" value="Masculin"/>Masculin<br/></div></center>
          <center>
          <button  class= "btn btn-primary" name="visit_ok"  ><span class="  icon-plus-circled-1"></span></button></center>
          <input type="submit" name="forminscription" />
          </center>
  
        
            
      </form>
<?php 

if(isset($_POST['nom']) && $_POST['nom']!=""){

      $nom1=$_POST['nom'];
      $prenom1=$_POST['prenom'];
      $date1=$_POST['date'];
      $heure1=$_POST['heure'];
      $Maux1=$_POST['Maux'];
      $filiere1=$_POST['filiere'];
      $plainte1=$_POST['plainte'];
      $contact1=$_POST['contact'];
      $age1=$_POST['age'];
      $sexe1=$_POST['sexe'];


	 $bdd=new PDO('mysql:host=localhost;dbname=papa;charset=utf8','root','',array(PDO::ATTR_ERRMODE=> PDO::ERRMODE_EXCEPTION));

   $insertmbr=$bdd->exec("UPDATE etudiant set nom='$nom1',prenom='$prenom1',dates='$date1',heures='$heure1',Maux='$Maux1',filiere='$filiere1',plainte='$plainte1',contact='$contact1',age='$age1',sexe='$sexe1' WHERE id='$id'");
  if ($insertmbr) 
  {
    echo"<script>alert('Rendez-Vous modifier')</script>";

    echo"<script>window.open('details-rendez_vous.php','_self')</script>";
  }
}
?>
