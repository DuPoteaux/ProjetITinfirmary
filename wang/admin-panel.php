<!DOCTYPE html>
<?php
setlocale(LC_TIME, 'fr');
	$bdd=new PDO('mysql:host=localhost;dbname=infirmerie;charset=utf8','root','',array(PDO::ATTR_ERRMODE=> PDO::ERRMODE_EXCEPTION));
	//include("func.php");
	$requete=$bdd->query("SELECT * FROM patient");
	
	$var=strftime('%A, le %d %B %Y');
	echo $var;

?>
<html>
<head>
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
    <div class="row"><form method="post" action="search_patient_submit.php">
      <input class="form-control mb-2 mr-sm-2 mb-sm-0" type="search" name="search" placeholder="Enter contact" aria-label="Search"></div>
      <button class="btn btn-success my-2 my-sm-0" type="submit" name="search_patient_submit"><span class="icon-search"> </button>
    &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp</button></form></div>
    <div class="panel bg-light" style="padding: 5px;">
  <a href="setting.php" class="btn btn-outline-success my-2 my-sm-0" role="button" aria-pressed="true">
<span class=" icon-cog-1">
Setting</a> &nbsp&nbsp &nbsp&nbsp 
		    <a href="#" class="btn btn-outline-success my-2 my-sm-0" role="button" aria-pressed="true">Help<span class="icon-help-circled"></a>&nbsp&nbsp&nbsp
  &nbsp&nbsp &nbsp&nbsp <a href="index.php" class="btn btn-outline-danger my-2 my-sm-0" role="button" aria-pressed="true"> <span class=" icon-logout-1"></span>Logout</a> 
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
        
      <center>
        <a href="visite.php"> 
        <h1 class="boxed_item boxed_item_smaller signup">
        <span class=""> </span>Ajouter un Patient </h1></a>
      </center>
      </li>
      <center>
      <center>
        <a href="details-rendez_vous.php"> 
        <h1 class="boxed_item boxed_item_smaller signup">
        <span class=""> </span> Listes des Patients</h1></a>
      </center>
      <center>
      </li>
		</div>
		</div>
	<div class="col-md-8">
	<div class="card">
		<div class="card-body" style="background-color:#3E4444; color:#ffffff;">
		<center>Bienvenue !!</center>
		</div>

		<?php
			echo "<p> Vous avez rendez-vous avec ses patients aujourd'hui :</p>";
			echo "<font color='black'><table  class='table table-hover'>

			<thead>
			<tr>
				<th>Nom Du Patient</th>
				<th>Prenom Du Patient </th>
				<th>Heures</th>
			</tr>
			</thead>
			</font>";
			while($date=$requete->fetch()){
				$affichage=strftime('%A, le %d %B %Y',strtotime($date['dates']));
				//echo $affichage."<br>";
				}
				if($var==$affichage){
								

					$affichages=date('Y-m-d');
					$patient=$bdd->query("SELECT DISTINCT * FROM patient WHERE dates='$affichages'");
					//$patient->setFetchMode(PDO::FETCH_ASSOC);
					while($patients=$patient->fetch()){
						echo"<tr>
			<td>".$patients['nom']."</td>
			<td>".$patients['prenom']."</td>
			<td>".$patients['heures']."</td>
			</tr>";
					}
				}else{
					echo "Veuillez l'Administrateur Web";
				}

		?>
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

