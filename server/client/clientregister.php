



<?php

require_once "../connection/connection.php";

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (isset($_GET['action'])) {
    $action = $_GET['action'];

    switch ($action) {
        case 'putRegisterData':        

            $data = json_decode($_POST['registerDataTemp'], true);
            $userregisterusername = $data['userregisterusername'];
            $userregisterpassword = $data['userregisterpassword'];

            $userregisteraddress = $data['userregisteraddress'];

            $file = $_FILES['userProfile'];


            $sql = "select*from client where clientusername = '$userregisterusername'";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                echo json_encode(true); // if client already exist
            }
            else {
                echo json_encode(false);

                $clientProfileName = $file['name'];
                $uniqueClientProfileName=  $clientProfileName . "_" . $timestamp = date("YmdHis");
                $clientProfileTMP = $file['tmp_name'];
                $clientProfileDestination = '../../public/asset/client/clientprofile/' . $uniqueClientProfileName;
    
                move_uploaded_file($clientProfileTMP, $clientProfileDestination);

                $sql = "INSERT INTO client (clientusername, clientpassword, clientaddress, clientprofile) VALUES ('$userregisterusername', '$userregisterpassword', '$userregisteraddress', '$uniqueClientProfileName')";
                $conn->query($sql);
            }
    
            $conn->close();
            break;
        }
}


?>