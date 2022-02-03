<!DOCTYPE html>
<html>
<head>

    <link href="dist/css/bootstrap.min.css" rel="stylesheet">
	 <link rel="stylesheet" type="text/css" href="css/style.css">
     <link rel="stylesheet" type="text/css" href="tutoriel.css">
	<title>detail_rendez-vous</title>
	 <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
 	<link rel="stylesheet" type="text/css" href="css/style.css">
<!-- Main CSS-->
<link rel="stylesheet" type="text/css" href="css/main.css">
<!-- Font-icon css-->
<link rel="stylesheet" type="text/css" href="css/font-awesome.min.css">
</head>
<body style="background-color:#3E4444";>
<?php
	$bdd=new PDO('mysql:host=localhost;dbname=papa;charset=utf8','root','',array(PDO::ATTR_ERRMODE=> PDO::ERRMODE_EXCEPTION));

	if(isset($_POST['search-rendez-vous']))
	{
		$nom=$_POST['search'];	
		$requete=$bdd->query("SELECT * FROM patient WHERE nom='$nom'");
	?>
			
			<div class="jumbotron" style="background:url('images/6.jpg') no-repeat;background-size:cover;height:300px"></div>
			<div class="container">
			<div class="card">
			<div class="card-body" style="color:#3E4444;">
			<div class="row">
			<div class="col-md-1"> 
			<a href="admin-panel.php" class="btn btn-light"><span class=" icon-left-bold"></a></div>
			<div class="col-md-3"><h3> Resultat Recherche </h3></div>
			<div class="col-md-6">
			</div>
			</div>
			</div>
			<div class="card-body">
			<font color="black"><table  class="table table-hover">

			<thead>
			<tr>
				<th>Nom Du Patient</th>
				<th>Prenom Du Patient </th>
				<th>Dates </th>
				<th>heures</th>
				<th>Dioptrie</th>
				<th>Profession</th>
				<th>EDV</th>
				<th>Contact</th>
				<th>Age</th>
				<th>Sexe</th>
			</tr>
			</thead>
			</font>
			<tbody>
		<?php 
		while($information=$requete->fetch()) 
		{
			$nom=$information['nom'];
            $prenom=$information['prenom'];
            $date=$information['dates'];
            $heure=$information['heures'];
            $dioptrie=$information['dioptrie'];
            $profession=$information['profession'];
            $edv=$information['edv'];
            $contact=$information['contact'];
            $age=$information['age'];
            $sexe=$information['sexe'];
		echo"<tr>
			<td>".$information['nom']."</td>
			<td>".$information['prenom']."</td>
			<td>".$information['dates']."</td>
			<td>".$information['heures']."</td>
			<td>".$information['dioptrie']."</td>
			<td>".$information['profession']."</td>
	        <td>".$information['edv']."</td>
			<td>".$information['contact']."</td>
			<td>".$information['age']."</td>
			<td>".$information['sexe']."</td>
			</tr>";
	
        }
        ?>
			</tbody>
			</table>
			
 			</div>

  

			</div>
<?php } ?>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
</body>
</html>