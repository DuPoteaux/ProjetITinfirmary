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
<div class="jumbotron" style="background:url('images/6.jpg') no-repeat;background-size:cover;height:300px"></div>
<div class="container">
<div class="card">
			<div class="card-body" style="color:#3E4444;">
			<div class="row">
			<div class="col-md-1"> 
			<a href="admin-panel.php" class="btn btn-light"><span class=" icon-left-bold"></a></div>
			<div class="col-md-3"><h3> details rendez-vous  </h3></div>
			<div class="col-md-6">
				<form class="form-group" action="search-rendez-vous.php" method="post"><div class="row">
				<div class="col-md-10"><input type="text" name="search" class="form-control" placeholder="Enter name" size="15%" required></div>
				<div class="col-md-2"><button type="submit" name="search-rendez-vous" class="btn btn-light"  required><span class="icon-search"></span></button>
				<script> 
				function imprimer() 
				{
					window.print();
				}
	            </script>&nbsp
				          &nbsp&nbsp&nbsp <input type="submit"  class="btn btn-light" Onclick="imprimer()" value="imprimer"> 
					
			
				 </div></div>

				</form>


			</div>
			</div>
			</div>
			<div class="card-body">
			<font color="black"><table  class="table table-hover">

			<thead>
			<tr>
				<th>Nom De l'etudiant</th>
				<th>Prenom De l'etudiant </th>
				<th>Dates </th>
				<th>heures</th>
				<th>Maux</th>
				<th>filiere</th>
				<th>PLAINTE</th>
				<th>Contact</th>
				<th>Age</th>
				<th>Sexe</th>
			</tr>
			</thead>
			</font>
			<tbody>
		<?php 

	$bdd=new PDO('mysql:host=localhost;dbname=infirmerie;charset=utf8','root','',array(PDO::ATTR_ERRMODE=> PDO::ERRMODE_EXCEPTION));

	$requete=$bdd->query("SELECT * FROM etudiant");	

		while($information=$requete->fetch()) 
		{
			?>
			<form method="post">
				<tr>
	<td><?php echo $information['nom'];?></td>
	<td><?php echo $information['prenom'];?></td>
	<td><?php echo $information['dates'];?></td>
	<td><?php echo $information['heures'];?></td>
	<td><?php echo $information['maux'];?></td>
	<td><?php echo $information['filiere'];?></td>
	<td><?php echo $information['plainte'];?></td>
	<td><?php echo $information['contact'];?></td>
	<td><?php echo $information['age'];?></td>
	<td><?php echo $information['sexe'];?></td>
	<td>
                  <a href="modifier_rdv.php?sup=<?php  echo ($information['id']) ?>"><span class=" icon-edit-1">Modifier</span></a>&nbsp;&nbsp;&nbsp;
                  <a href="supprimer_rdv.php?sup=<?php  echo ($information['id'])?>"><span class="icon-cancel-circled2">supprimer</span></a>
	<?php
        }
        ?>

			</tbody>
			</table>
			
 			</div>

  

			</div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
</body>
</html>