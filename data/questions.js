window.DOP_QUESTIONS = [
 {
  "n": 1,
  "title": "Aurora with a single DB instance: high availability during maintenance",
  "summary": "An Aurora cluster has only one DB instance (the writer). During maintenance or updates the cluster goes down. The application connects through the instance endpoint. The cluster must stay available with minimal disruption.",
  "stem": "A company is using an Amazon Aurora cluster as the data store for its application. The Aurora cluster is configured with a single DB instance. The application performs read operations and write operations on the database by using the cluster's instance endpoint.\n\nThe company has scheduled an update to the cluster during the next maintenance window. The cluster must remain available with the least possible interruption during the maintenance window.\n\nWhich solution will meet these requirements?",
  "opts": [
   {
    "l": "A",
    "t": "Add a reader instance to the Aurora cluster. Update the application to use the Aurora cluster's cluster endpoint for write operations. Update the application to use the Aurora cluster's reader endpoint for read operations."
   },
   {
    "l": "B",
    "t": "Add a reader instance to the Aurora cluster. Create a custom ANY endpoint for the cluster. Update the application to use the Aurora cluster's custom ANY endpoint for read operations and write operations."
   },
   {
    "l": "C",
    "t": "Turn on the Multi-AZ option on the Aurora cluster. Configure an Amazon RDS proxy in front of the Aurora cluster. Update the application to use the RDS proxy's default endpoint for read operations and write operations."
   },
   {
    "l": "D",
    "t": "Turn on the Multi-AZ option on the Aurora cluster. Create a custom ANY endpoint for the cluster. Update the application to use the Aurora cluster's custom ANY endpoint for read operations and write operations."
   }
  ],
  "ans": [
   "A"
  ],
  "multi": 1,
  "expl": [
   "With a single instance, every maintenance event restarts that instance and the whole cluster stops serving traffic. To reduce disruption, Aurora needs at least one reader instance that can take over: when the writer is under maintenance, the reader is promoted to writer within tens of seconds. The application must also change how it connects. An instance endpoint is bound to one specific instance, so it points to the wrong place after a failover. Use the cluster endpoint for writes (always points to the current writer) and the reader endpoint for reads (load-balances across readers)."
  ],
  "wrong": [
   {
    "l": "B and D",
    "t": "A custom endpoint of type ANY can include both the writer and readers, so write statements may be sent to a read-only reader and fail. D also only turns on Multi-AZ without adding a reader instance."
   },
   {
    "l": "C",
    "t": "For Aurora, simply enabling the Multi-AZ option without any replica does not create a standby instance. RDS Proxy does not create high availability on its own either."
   }
  ],
  "remember": "Aurora HA = add a reader/replica + use the cluster endpoint (writes) and reader endpoint (reads). Avoid instance endpoints in applications.",
  "note": ""
 },
 {
  "n": 2,
  "title": "Scan ECR images for vulnerabilities and block CRITICAL/HIGH findings",
  "summary": "A pipeline must scan images in Amazon ECR for vulnerabilities in both the operating system and programming-language packages, and must block images that have CRITICAL or HIGH vulnerabilities.",
  "stem": "A company needs to increase the security of the container images that run in its production environment. The company wants to integrate operating system scanning and programming language package vulnerability scanning for the containers in its CI/CD pipeline. The CI/CD pipeline is an AWS CodePipeline pipeline that includes an AWS CodeBuild build project, AWS CodeDeploy actions, and an Amazon Elastic Container Registry (Amazon ECR) repository.\n\nA DevOps engineer needs to add an image scan to the CI/CD pipeline. The CI/CD pipeline must deploy only images without CRITICAL and HIGH findings into production.\n\nWhich combination of steps will meet these requirements? (Select TWO.)",
  "opts": [
   {
    "l": "A",
    "t": "Use Amazon ECR basic scanning."
   },
   {
    "l": "B",
    "t": "Use Amazon ECR enhanced scanning."
   },
   {
    "l": "C",
    "t": "Configure Amazon ECR to submit a Rejected status to the CI/CD pipeline when the image scan returns CRITICAL or HIGH findings."
   },
   {
    "l": "D",
    "t": "Configure an Amazon EventBridge rule to invoke an AWS Lambda function when the image scan is completed. Configure the Lambda function to consume the Amazon Inspector scan status and to submit an Approved or Rejected status to the CI/CD pipeline."
   },
   {
    "l": "E",
    "t": "Configure an Amazon EventBridge rule to invoke an AWS Lambda function when the image scan is completed. Configure the Lambda function to consume the Clair scan status and to submit an Approved or Rejected status to the CI/CD pipeline."
   }
  ],
  "ans": [
   "B",
   "D"
  ],
  "multi": 2,
  "expl": [
   "B: ECR enhanced scanning integrates with Amazon Inspector and scans both OS vulnerabilities and language packages (Java, Python, Node, ...). Basic scanning only scans OS vulnerabilities using Clair.",
   "D: When Inspector finishes a scan it emits an event to EventBridge. An EventBridge rule invokes a Lambda function; the function reads the findings and returns an Approved or Rejected status to CodePipeline (for example, for a manual approval or custom action), which blocks images with CRITICAL/HIGH vulnerabilities."
  ],
  "wrong": [
   {
    "l": "A and E",
    "t": "Basic scanning (Clair) does not scan programming-language packages, so it does not meet the requirement."
   },
   {
    "l": "C",
    "t": "ECR has no built-in way to send a Rejected status to the pipeline; an intermediate component such as EventBridge + Lambda is required."
   }
  ],
  "remember": "Need language-package scanning = Enhanced scanning (Inspector). Feed the result into the pipeline via EventBridge + Lambda.",
  "note": ""
 },
 {
  "n": 3,
  "title": "CodeDeploy blue/green fails at the AllowTraffic event: detect failure faster",
  "summary": "A CodeDeploy blue/green deployment with an ALB waits a very long time at the AllowTraffic event before reporting a failure. The team needs to detect failures sooner while keeping the application available.",
  "stem": "A development team manages website deployments using AWS CodeDeploy blue/green deployments. The application is running on Amazon EC2 instances behind an Application Load Balancer in an Auto Scaling group.\n\nWhen deploying a new revision, the team notices the deployment eventually fails, but it takes a long time to fail. After further inspection, the team discovers the AllowTraffic lifecycle event ran for an hour and eventually failed without providing any other information. The team wants to ensure failure notices are delivered more quickly while maintaining application availability even upon failure.\n\nWhich combination of actions should be taken to meet these requirements? (Select TWO.)",
  "opts": [
   {
    "l": "A",
    "t": "Change the deployment configuration to CodeDeployDefault.AllAtOnce to speed up the deployment process by deploying to all of the instances at the same time."
   },
   {
    "l": "B",
    "t": "Create a CodeDeploy trigger for the deployment failure event and make the deployment fail as soon as a single health check failure is detected."
   },
   {
    "l": "C",
    "t": "Reduce the HealthCheckIntervalSeconds and UnhealthyThresholdCount values within the target group health checks to decrease the amount of time it takes for the application to be considered unhealthy."
   },
   {
    "l": "D",
    "t": "Use the appspec.yml file to run a script on the AllowTraffic hook to perform lighter health checks on the application instead of making CodeDeploy wait for the target group health checks to pass."
   },
   {
    "l": "E",
    "t": "Use the appspec.yml file to run a script on the BeforeAllowTraffic hook to perform health checks on the application and fail the deployment if the health checks performed by the script are not successful."
   }
  ],
  "ans": [
   "C",
   "E"
  ],
  "multi": 2,
  "expl": [
   "C: AllowTraffic waits for the target group's health check to report healthy. If HealthCheckIntervalSeconds and UnhealthyThresholdCount are large, CodeDeploy has to wait a long time (up to about 1 hour). Lowering both values lets it detect unhealthy instances and fail fast.",
   "E: The BeforeAllowTraffic hook lets you run a script that validates the application before traffic is switched. If the script fails, the deployment fails early and traffic stays on the old (blue) environment, so the application remains available."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "AllAtOnce deploys everything at the same time, which reduces availability when the new version is faulty."
   },
   {
    "l": "B",
    "t": "CodeDeploy has no setting to \"fail immediately when one health check fails\". Triggers only send notifications; they do not make the deployment fail faster."
   },
   {
    "l": "D",
    "t": "AllowTraffic is managed by CodeDeploy itself; you cannot attach a custom script to this event."
   }
  ],
  "remember": "AllowTraffic is managed by CodeDeploy; for custom checks use BeforeAllowTraffic/AfterAllowTraffic. The target group's health check settings determine how long it waits.",
  "note": ""
 },
 {
  "n": 4,
  "title": "Mask sensitive data (employee ID Emp-XXXXXX) in CloudWatch Logs",
  "summary": "Logs contain employee IDs in the format Emp-XXXXXX (6 digits). The data must be masked in the logs, and engineers who currently have logs:* must only see the masked data.",
  "stem": "A DevOps administrator is responsible for managing the security of a company's Amazon CloudWatch Logs log groups. The company's security policy states that employee IDs must not be visible in logs except by authorized personnel. Employee IDs follow the pattern of Emp-XXXXXX, where each X is a digit.\n\nAn audit discovered that employee IDs are found in a single log file. The log file is available to engineers, but the engineers are not authorized to view employee IDs. Engineers currently have an AWS IAM Identity Center permission that allows logs:* on all resources in the account.\n\nThe administrator must mask the employee ID so that new log entries that contain the employee ID are not visible to unauthorized personnel.\n\nWhich solution will meet these requirements with the MOST operational efficiency?",
  "opts": [
   {
    "l": "A",
    "t": "Create a new data protection policy on the log group. Add an Emp-\\d{6} custom data identifier configuration. Create an IAM policy that has a Deny action for the \"Action\":\"logs:Unmask\" permission on the resource. Attach the policy to the engineering accounts."
   },
   {
    "l": "B",
    "t": "Create a new data protection policy on the log group. Add managed data identifiers for the personal data category. Create an IAM policy that has a Deny action for the \"NotAction\":\"logs:Unmask\" permission on the resource. Attach the policy to the engineering accounts."
   },
   {
    "l": "C",
    "t": "Create an AWS Lambda function to parse a log file entry, remove the employee ID, and write the results to a new log file. Create a Lambda subscription filter on the log group and select the Lambda function. Grant the lambda:InvokeFunction permission to the log group."
   },
   {
    "l": "D",
    "t": "Create an Amazon Data Firehose delivery stream that has an Amazon S3 bucket as the destination. Create a Firehose subscription filter on the log group that uses the Firehose delivery stream. Remove the \"logs:*\" permission on the engineering accounts. Create an Amazon Macie job on the S3 bucket that has an Emp-\\d{6} custom identifier."
   }
  ],
  "ans": [
   "A"
  ],
  "multi": 1,
  "expl": [
   "A CloudWatch Logs data protection policy can detect and mask sensitive data in new log events. Because the employee ID is a custom format, you must use a custom data identifier with the regex Emp-\\d{6}. The original data can only be viewed with the logs:Unmask permission. Engineers with logs:* already include Unmask, so you need an IAM policy that explicitly Denies logs:Unmask for them so they only see the masked data."
  ],
  "wrong": [
   {
    "l": "B",
    "t": "A managed data identifier for personal data does not recognize the Emp-XXXXXX format. A Deny with NotAction would block every action except logs:Unmask, which has the opposite effect."
   },
   {
    "l": "C",
    "t": "Using Lambda to parse and rewrite logs is operationally heavy, and the original logs still contain the employee IDs."
   },
   {
    "l": "D",
    "t": "Firehose, S3 and Macie are complex, do not mask data inside the log group, and Macie only detects data; it does not mask it."
   }
  ],
  "remember": "Masking data in logs = data protection policy; custom formats = custom data identifier (regex); control who can see it with logs:Unmask.",
  "note": ""
 },
 {
  "n": 5,
  "title": "CloudFormation deployment to existing and future accounts in Organizations",
  "summary": "A stack must be deployed to every existing account and to accounts that join the organization later, with the lowest operational effort.",
  "stem": "A company is implementing a standardized security baseline across its AWS accounts. The accounts are in an organization in AWS Organizations.\n\nThe company must deploy consistent IAM roles and policies across all existing and future accounts in the organization.\n\nWhich solution will meet these requirements with the MOST operational efficiency?",
  "opts": [
   {
    "l": "A",
    "t": "Enable AWS Control Tower in the management account. Configure AWS Control Tower Account Factory customization to deploy the required IAM roles and policies to all accounts."
   },
   {
    "l": "B",
    "t": "Activate trusted access for AWS CloudFormation StackSets in Organizations. In the management account, create a stack set that has service-managed permissions to deploy the required IAM roles and policies to all accounts. Enable automatic deployment for the stack set."
   },
   {
    "l": "C",
    "t": "In each member account, create IAM roles that have permissions to create and manage resources. In the management account, create an AWS CloudFormation stack set that has self-managed permissions to deploy the required IAM roles and policies to all accounts. Enable automatic deployment for the stack set."
   },
   {
    "l": "D",
    "t": "In the management account, create an AWS CodePipeline pipeline. Configure the pipeline to use AWS CloudFormation to automate the deployment of the required IAM roles and policies. Set up cross-account IAM roles to allow CodePipeline to deploy resources in the member accounts."
   }
  ],
  "ans": [
   "B"
  ],
  "multi": 1,
  "expl": [
   "Enable trusted access for CloudFormation StackSets in Organizations so StackSets can work across the whole organization without creating roles manually in each account. Use service-managed permissions: AWS automatically creates the required IAM roles in target accounts. Turn on automatic deployment: new accounts that join the OU/organization automatically receive the stack set, which satisfies \"existing and future accounts\"."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "Account Factory customization only applies to accounts newly created through Control Tower and does not cover existing accounts; setting up Control Tower is also far heavier."
   },
   {
    "l": "C",
    "t": "Self-managed permissions require creating roles manually in every member account, which is laborious and error-prone."
   },
   {
    "l": "D",
    "t": "Building your own pipeline with cross-account roles requires a lot of maintenance and is less efficient than StackSets."
   }
  ],
  "remember": "StackSets + service-managed + automatic deployment = also covers new accounts automatically.",
  "note": ""
 },
 {
  "n": 6,
  "title": "Enable GuardDuty with StackSets when some accounts already have it enabled",
  "summary": "A template that enables GuardDuty is deployed to many accounts using StackSets, but some accounts already have GuardDuty so the deployment fails. The deployment must not fail.",
  "stem": "A company manages AWS accounts for application teams in AWS Control Tower. Individual application teams are responsible for securing their respective AWS accounts.\n\nA DevOps engineer needs to enable Amazon GuardDuty for all AWS accounts in which the application teams have not already enabled GuardDuty. The DevOps engineer is using AWS CloudFormation StackSets from the AWS Control Tower management account.\n\nHow should the DevOps engineer configure the CloudFormation template to prevent failure during the StackSets deployment?",
  "opts": [
   {
    "l": "A",
    "t": "Create a CloudFormation custom resource that invokes an AWS Lambda function. Configure the Lambda function to conditionally enable GuardDuty if GuardDuty is not already enabled in the accounts."
   },
   {
    "l": "B",
    "t": "Use the Conditions section of the CloudFormation template to enable GuardDuty in accounts where GuardDuty is not already enabled."
   },
   {
    "l": "C",
    "t": "Use the CloudFormation Fn::GetAtt intrinsic function to check whether GuardDuty is already enabled. If GuardDuty is not already enabled, use the Resources section of the CloudFormation template to enable GuardDuty."
   },
   {
    "l": "D",
    "t": "Manually discover the list of AWS account IDs where GuardDuty is not enabled. Use the CloudFormation Fn::ImportValue intrinsic function to import the list of account IDs into the CloudFormation template to skip deployment for the listed AWS accounts."
   }
  ],
  "ans": [
   "A"
  ],
  "multi": 1,
  "expl": [
   "Plain CloudFormation does not check whether GuardDuty is already enabled; creating a detector in an account that already has one fails and causes the whole StackSets operation to fail. The solution is a custom resource backed by Lambda: the Lambda function uses the API (for example ListDetectors) to check, and only enables GuardDuty when it is not already enabled, so the deployment always succeeds."
  ],
  "wrong": [
   {
    "l": "B",
    "t": "Conditions are evaluated only from parameters, pseudo parameters or input values; they cannot query the real state of a service."
   },
   {
    "l": "C",
    "t": "Fn::GetAtt only reads attributes of resources created by the stack itself; it has no knowledge of a GuardDuty that was enabled earlier."
   },
   {
    "l": "D",
    "t": "Finding the list of accounts manually is not automated and goes stale quickly; Fn::ImportValue is not used to skip accounts."
   }
  ],
  "remember": "Need logic that checks real state inside CloudFormation = custom resource + Lambda.",
  "note": ""
 },
 {
  "n": 7,
  "title": "Add a 20-minute test stage to CodePipeline before deploying to staging",
  "summary": "A code merge into the main branch triggers the pipeline. A test suite that takes about 20 minutes must run, and the deployment to staging must be blocked if the tests fail.",
  "stem": "A company is building a web application on AWS. The application uses AWS CodeConnections to access a Git repository. The company sets up a pipeline in AWS CodePipeline that automatically builds and deploys the application to a staging environment when the company pushes code to the main branch. Bugs and integration issues sometimes occur in the main branch because there is no automated testing integrated into the pipeline.\n\nThe company wants to automatically run tests when code merges occur in the Git repository and to prevent deployments from reaching the staging environment if any test fails. Tests can run up to 20 minutes.\n\nWhich solution will meet these requirements?",
  "opts": [
   {
    "l": "A",
    "t": "Add an AWS CodeBuild action to the pipeline. Add a buildspec.yml file to the Git repository to define commands to run tests. Configure the pipeline to stop the deployment if a test fails."
   },
   {
    "l": "B",
    "t": "Configure Git webhooks to initiate an AWS Lambda function during each code merge. Configure the Lambda function to run tests programmatically and to stop the pipeline if a test fails."
   },
   {
    "l": "C",
    "t": "Configure AWS Batch to use Docker images of test environments. Integrate AWS Batch into the pipeline. Add an AWS Lambda function to the pipeline that submits the batch jobs and reverts the code merge if a test fails."
   },
   {
    "l": "D",
    "t": "Configure the Git repository to push code to an Amazon S3 bucket during each code merge. Use S3 Event Notifications to initiate tests and to revert the code merge if a test fails."
   }
  ],
  "ans": [
   "A"
  ],
  "multi": 1,
  "expl": [
   "Add a CodeBuild action in a test stage placed before the deploy stage. The test commands are defined in buildspec.yml. If the tests fail, the action fails, the pipeline stops and the faulty build never reaches staging. CodeBuild can run long tasks (up to 8 hours), so a 20-minute test run is not a problem."
  ],
  "wrong": [
   {
    "l": "B",
    "t": "Lambda is limited to 15 minutes, which is not enough for a 20-minute test; you would also have to build the webhook and pipeline-control logic yourself."
   },
   {
    "l": "C",
    "t": "AWS Batch + Lambda is overly complex; \"reverting the merged code\" is not the standard approach, since the requirement is only to block the deployment."
   },
   {
    "l": "D",
    "t": "Pushing code through S3 and using S3 events does not integrate with the existing pipeline, and Lambda still has the 15-minute limit."
   }
  ],
  "remember": "Long tests in CI/CD = CodeBuild action. Lambda maximum is 15 minutes.",
  "note": ""
 },
 {
  "n": 8,
  "title": "Automated patching for EC2, IoT Greengrass devices and on-premises servers",
  "summary": "Patches must be applied automatically and on a schedule across a mixed fleet: EC2 instances, IoT devices running Greengrass, and on-premises servers.",
  "stem": "A company deploys its corporate infrastructure on AWS across multiple AWS Regions and Availability Zones. The infrastructure is deployed on Amazon EC2 instances and connects with AWS IoT Greengrass devices. The company deploys additional resources on on-premises servers that are located in the corporate headquarters.\n\nThe company wants to reduce the overhead involved in maintaining and updating its resources. The company's DevOps team plans to use AWS Systems Manager to implement automated management and application of patches. The DevOps team confirms that Systems Manager is available in the Regions that the resources are deployed in. Systems Manager also is available in a Region near the corporate headquarters.\n\nWhich combination of steps must the DevOps team take to implement automated patch and configuration management across the company's EC2 instances, IoT devices, and on-premises infrastructure? (Select THREE.)",
  "opts": [
   {
    "l": "A",
    "t": "Apply tags to all the EC2 instances, AWS IoT Greengrass devices, and on-premises servers. Use Systems Manager Session Manager to push patches to all the tagged devices."
   },
   {
    "l": "B",
    "t": "Use Systems Manager Run Command to schedule patching for the EC2 instances, AWS IoT Greengrass devices, and on-premises servers."
   },
   {
    "l": "C",
    "t": "Use Systems Manager Patch Manager to schedule patching for the EC2 instances, AWS IoT Greengrass devices, and on-premises servers as a Systems Manager maintenance window task."
   },
   {
    "l": "D",
    "t": "Configure Amazon EventBridge to monitor Systems Manager Patch Manager for updates to patch baselines. Associate Systems Manager Run Command with the event to initiate a patch action for all EC2 instances, AWS IoT Greengrass devices, and on-premises servers."
   },
   {
    "l": "E",
    "t": "Create an IAM instance profile for Systems Manager. Attach the instance profile to all the EC2 instances in the AWS account. For the AWS IoT Greengrass devices and on-premises servers, create an IAM service role for Systems Manager."
   },
   {
    "l": "F",
    "t": "Generate a managed-node activation. Use the Activation Code and Activation ID to install Systems Manager Agent (SSM Agent) on each server in the on-premises environment. Update the AWS IoT Greengrass IAM token exchange role. Use the role to deploy SSM Agent on all the IoT devices."
   }
  ],
  "ans": [
   "C",
   "E",
   "F"
  ],
  "multi": 3,
  "expl": [
   "C: Patch Manager is the dedicated tool for patching against a patch baseline; combine it with a maintenance window to schedule recurring patching for every managed node.",
   "E: EC2 uses an instance profile. Greengrass devices and on-premises servers are not EC2, so they need an IAM service role for Systems Manager to manage them.",
   "F: Register nodes outside AWS with a managed-node activation (Activation Code and Activation ID) and install the SSM Agent. For Greengrass devices, update the token exchange role and deploy the SSM Agent."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "Session Manager opens interactive shell sessions; it is not used for bulk patching."
   },
   {
    "l": "B",
    "t": "Run Command executes commands on demand; it is not a baseline-driven patching tool like Patch Manager."
   },
   {
    "l": "D",
    "t": "EventBridge + Run Command to track baselines is complex and unnecessary."
   }
  ],
  "remember": "Bringing non-AWS nodes into Systems Manager = hybrid activation + SSM Agent + service role.",
  "note": ""
 },
 {
  "n": 9,
  "title": "Low-cost API for customers to upload files to S3, with an OpenAPI spec",
  "summary": "An API is needed for customers to upload files to S3 at the lowest cost, and an OpenAPI specification must be available for customers.",
  "stem": "A software as a service (SaaS) company wants to implement file uploads for its customers. Industry standards require that the company provide OpenAPI specifications to its customers. The company will use Amazon S3 for file storage.\n\nWhich solution will meet these requirements MOST cost-effectively?",
  "opts": [
   {
    "l": "A",
    "t": "Create an Application Load Balancer. Create an Amazon Elastic Container Service (Amazon ECS) cluster for the application to process uploads to Amazon S3. Generate the OpenAPI definitions separately."
   },
   {
    "l": "B",
    "t": "Create an Amazon API Gateway REST API. Set up an AWS service integration for the upload. Create mapping templates to transform the requests and responses to match AWS API requirements. Export the OpenAPI definition."
   },
   {
    "l": "C",
    "t": "Create an AWS Verified Access instance. Deploy an Amazon EC2 instance with the application to process uploads. Connect the instance as a network interface endpoint. Generate the OpenAPI definitions separately."
   },
   {
    "l": "D",
    "t": "Create an Amazon CloudFront distribution. Create a Lambda@Edge function as an authorizer. Configure the S3 bucket for the uploads. Write an AWS Lambda function to periodically export the OpenAPI definition from CloudFront."
   }
  ],
  "ans": [
   "B"
  ],
  "multi": 1,
  "expl": [
   "An API Gateway REST API integrates directly with S3 through an AWS service integration; no servers or containers are needed, so the cost is lowest. Mapping templates transform requests/responses to match the S3 API. API Gateway can export the OpenAPI definition directly, which meets the requirement to provide OpenAPI to customers."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "ALB + an ECS cluster costs money to run continuously and requires writing your own application; the OpenAPI spec would have to be produced separately."
   },
   {
    "l": "C",
    "t": "Verified Access is for zero-trust access to internal applications and is not suitable for customer uploads; EC2 adds cost."
   },
   {
    "l": "D",
    "t": "CloudFront + Lambda@Edge is not a standard upload-API solution and does not generate an exportable OpenAPI definition."
   }
  ],
  "remember": "An API that talks directly to an AWS service without compute = API Gateway service integration.",
  "note": ""
 },
 {
  "n": 10,
  "title": "Patch Manager with a custom repository containing application patches",
  "summary": "Patches must be scanned and installed from both the OS default repositories and a custom repository containing application patches, automatically and with minimal effort.",
  "stem": "A company that uses electronic patient health records runs a fleet of Amazon EC2 instances with an Amazon Linux operating system. The company must continuously ensure that the EC2 instances are running operating system patches and application patches that are in compliance with current privacy regulations. The company uses a custom repository to store application patches.\n\nA DevOps engineer needs to automate the deployment of operating system patches and application patches. The DevOps engineer wants to use both the default operating system patch repository and the custom patch repository.\n\nWhich solution will meet these requirements with the LEAST effort?",
  "opts": [
   {
    "l": "A",
    "t": "Use AWS Systems Manager to create a new custom patch baseline that includes the default operating system repository and the custom repository. Run the AWS-RunPatchBaseline document by using the Run command to verify and install patches. Use the BaselineOverride API to configure the new custom patch baseline."
   },
   {
    "l": "B",
    "t": "Use AWS Direct Connect to integrate the custom repository with the EC2 instances. Use Amazon EventBridge events to deploy the patches."
   },
   {
    "l": "C",
    "t": "Use the yum-config-manager command to add the custom repository to the /etc/yum.repos.d configuration. Run the yum-config-manager-enable command to activate the new repository."
   },
   {
    "l": "D",
    "t": "Use AWS Systems Manager to create a patch baseline for the default operating system repository and a second patch baseline for the custom repository. Run the AWS-RunPatchBaseline document by using the Run command to verify and install patches. Use the BaselineOverride API to configure the default patch baseline and the custom patch baseline."
   }
  ],
  "ans": [
   "A"
  ],
  "multi": 1,
  "expl": [
   "A patch baseline for Linux can declare multiple patch sources. Create a custom patch baseline that includes both the default repositories and the custom repository. Use the AWS-RunPatchBaseline document through Run Command with BaselineOverride to apply this baseline when scanning/installing. Only one baseline is needed, so it takes the least effort."
  ],
  "wrong": [
   {
    "l": "B",
    "t": "Direct Connect is a dedicated network connection; it is not used to integrate repositories or deploy patches."
   },
   {
    "l": "C",
    "t": "Adding the repository with yum-config-manager on each instance is manual and not centrally managed."
   },
   {
    "l": "D",
    "t": "Two separate baselines increase management effort; each BaselineOverride applies only one baseline."
   }
  ],
  "remember": "Multiple patch sources for Linux = one custom baseline with multiple patch sources.",
  "note": ""
 },
 {
  "n": 11,
  "title": "Restrict 10 S3 buckets to a new IP range and revoke access for 2 OUs",
  "summary": "Only a new IP range must be allowed to access 10 S3 buckets, and access for two OUs must be revoked.",
  "stem": "A company manages multiple AWS accounts by using AWS Organizations with OUs for the different business divisions. The company is updating their corporate network to use new IP address ranges. The company has 10 Amazon S3 buckets in different AWS accounts. The S3 buckets store reports for the different divisions. The S3 bucket configurations allow only private corporate network IP addresses to access the S3 buckets.\n\nA DevOps engineer needs to change the range of IP addresses that have permission to access the contents of the S3 buckets. The DevOps engineer also needs to revoke the permissions of two OUs in the company.\n\nWhich solution will meet these requirements?",
  "opts": [
   {
    "l": "A",
    "t": "Create a new SCP that has two statements, one that allows access to the new range of IP addresses for all the S3 buckets and one that denies access to the old range of IP addresses for all the S3 buckets. Set a permissions boundary for the OrganizationAccountAccessRole role in the two OUs to deny access to the S3 buckets."
   },
   {
    "l": "B",
    "t": "Create a new SCP that has a statement that allows only the new range of IP addresses to access the S3 buckets. Create another SCP that denies access to the S3 buckets. Attach the second SCP to the two OUs."
   },
   {
    "l": "C",
    "t": "On all the S3 buckets, configure resource-based policies that allow only the new range of IP addresses to access the S3 buckets. Create a new SCP that denies access to the S3 buckets. Attach the SCP to the two OUs."
   },
   {
    "l": "D",
    "t": "On all the S3 buckets, configure resource-based policies that allow only the new range of IP addresses to access the S3 buckets. Set a permissions boundary for the OrganizationAccountAccessRole role in the two OUs to deny access to the S3 buckets."
   }
  ],
  "ans": [
   "C"
  ],
  "multi": 1,
  "expl": [
   "IP-range restrictions are configured in the bucket policy (the aws:SourceIp condition), so the resource-based policy on all 10 buckets must be updated. To revoke access for the two OUs: create an SCP that Denies access to those buckets and attach it to the two OUs. An SCP applies to every account in the OU, so it is effective and easy to manage."
  ],
  "wrong": [
   {
    "l": "A and B",
    "t": "An SCP only sets a maximum boundary and does not grant permissions, so an allow statement in an SCP does not give the new IP range access; the bucket policy would still hold the old IP range."
   },
   {
    "l": "A and D",
    "t": "A permissions boundary is attached to individual IAM roles/users, not to an OU; it is less efficient than an OU-level SCP."
   }
  ],
  "remember": "SCP = restricts only, never grants. S3 IP restrictions live in the bucket policy.",
  "note": ""
 },
 {
  "n": 12,
  "title": "EKS: UnauthorizedOperation error when creating a gp3 EBS volume",
  "summary": "A pod on EKS requests a gp3 PersistentVolume but the driver reports UnauthorizedOperation when creating the volume. The cluster already has an OIDC issuer.",
  "stem": "A DevOps engineer provisioned an Amazon Elastic Kubernetes Service (Amazon EKS) cluster with managed node groups. The DevOps engineer associated an OpenID Connect (OIDC) issuer with the cluster.\n\nThe DevOps engineer is configuring Amazon Elastic Block Store (Amazon EBS) General Purpose SSD (gp3) volumes for the cluster. The DevOps engineer attempts to initiate a PersistentVolumeClaim (PVC) request but is unable to provision a volume. To troubleshoot the issue, the DevOps engineer runs the kubectl describe pvc command. The DevOps engineer receives a failed to provision volume with StorageClass error and a could not create volume in EC2: UnauthorizedOperation error.\n\nWhich solution will resolve these errors?",
  "opts": [
   {
    "l": "A",
    "t": "Create a Kubernetes cluster role that allows the persistent volumes to perform get, list, watch, create, and delete operations. Configure the cluster role to allow get, list, and watch operations for storage in the cluster."
   },
   {
    "l": "B",
    "t": "Create an Amazon EBS Container Storage Interface (CSI) driver IAM role that has the required permissions and trust relationships. Attach the IAM role to the Amazon EBS CSI driver add-on in the cluster."
   },
   {
    "l": "C",
    "t": "Add the ebs.csi.aws.com/volumeType: gp3 annotation to the PersistentVolumeClaim object in the cluster."
   },
   {
    "l": "D",
    "t": "Create a Kubernetes storage class object. Set the provisioner value to ebs.csi.aws.com. Set the volumeBindingMode value to WaitForFirstConsumer in the cluster."
   }
  ],
  "ans": [
   "B"
  ],
  "multi": 1,
  "expl": [
   "UnauthorizedOperation when creating a volume means the EBS CSI driver does not have permission to call EC2 APIs such as CreateVolume. The correct approach (IRSA): create an IAM role for the EBS CSI driver with the required permissions and a trust relationship that trusts the cluster's OIDC provider, then attach the role to the Amazon EBS CSI driver add-on."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "A Kubernetes cluster role (RBAC) only controls permissions inside Kubernetes; it does not grant permission to call EC2 APIs."
   },
   {
    "l": "C",
    "t": "An annotation about volume type only selects the volume type; it does not fix a missing-permission error."
   },
   {
    "l": "D",
    "t": "A StorageClass with WaitForFirstConsumer only affects when the volume is bound; it does not fix permission errors."
   }
  ],
  "remember": "AWS permissions for pods/drivers in EKS = IRSA (IAM role attached via OIDC), not RBAC.",
  "note": ""
 },
 {
  "n": 13,
  "title": "Lambda reading from RDS: reduce connection load with RDS Proxy",
  "summary": "Many concurrent Lambda functions only read from the database and exhaust its connections. The load must be reduced and reads distributed.",
  "stem": "A DevOps engineer is building an application that uses an AWS Lambda function to query an Amazon Aurora MySQL DB cluster. The Lambda function performs only read queries. Amazon EventBridge events invoke the Lambda function.\n\nAs more events invoke the Lambda function each second, the database's latency increases and the database's throughput decreases. The DevOps engineer needs to improve the performance of the application.\n\nWhich combination of steps will meet these requirements? (Select THREE.)",
  "opts": [
   {
    "l": "A",
    "t": "Use Amazon RDS Proxy to create a proxy. Connect the proxy to the Aurora cluster reader endpoint. Set a maximum connections percentage on the proxy."
   },
   {
    "l": "B",
    "t": "Implement database connection pooling inside the Lambda code. Set a maximum number of connections on the database connection pool."
   },
   {
    "l": "C",
    "t": "Implement the database connection opening outside the Lambda event handler code."
   },
   {
    "l": "D",
    "t": "Implement the database connection opening and closing inside the Lambda event handler code."
   },
   {
    "l": "E",
    "t": "Connect to the proxy endpoint from the Lambda function."
   },
   {
    "l": "F",
    "t": "Connect to the Aurora cluster endpoint from the Lambda function."
   }
  ],
  "ans": [
   "A",
   "C",
   "E"
  ],
  "multi": 3,
  "expl": [
   "A: RDS Proxy pools and reuses connections; point it at the reader endpoint to spread read load, and set the maximum connections percentage to avoid exhausting database connections.",
   "C: Open the connection at global scope (outside the event handler) so invocations in the same execution environment reuse it.",
   "E: Lambda must connect to the proxy endpoint to benefit from connection pooling."
  ],
  "wrong": [
   {
    "l": "B",
    "t": "Pooling inside the Lambda code is ineffective because each execution environment is isolated; the number of connections still grows with the number of Lambda instances."
   },
   {
    "l": "D",
    "t": "Opening/closing the connection inside the handler creates a new connection on every invocation, increasing latency and connection count."
   },
   {
    "l": "F",
    "t": "Connecting directly to the cluster endpoint (writer) bypasses the proxy, does not fix the overload and does not use the readers."
   }
  ],
  "remember": "Lambda + RDS: RDS Proxy + connection declared outside the handler + use the proxy endpoint.",
  "note": ""
 },
 {
  "n": 14,
  "title": "Expand an application to a new continent for lower latency and higher availability",
  "summary": "A web application (ALB, Auto Scaling, DynamoDB) must serve users on a new continent with low latency and high availability.",
  "stem": "A company's application is currently deployed to a single AWS Region. Recently, the company opened a new office on a different continent. The users in the new office are experiencing high latency. The company's application runs on Amazon EC2 instances behind an Application Load Balancer (ALB) and uses Amazon DynamoDB as the database layer. The instances run in an EC2 Auto Scaling group across multiple Availability Zones. A DevOps engineer is tasked with minimizing application response times and improving availability for users in both Regions.\n\nWhich combination of actions should be taken to address the latency issues? (Select THREE.)",
  "opts": [
   {
    "l": "A",
    "t": "Create a new DynamoDB table in the new Region with cross-Region replication enabled."
   },
   {
    "l": "B",
    "t": "Create new ALB and Auto Scaling group global resources and configure the new ALB to direct traffic to the new Auto Scaling group."
   },
   {
    "l": "C",
    "t": "Create new ALB and Auto Scaling group resources in the new Region and configure the new ALB to direct traffic to the new Auto Scaling group."
   },
   {
    "l": "D",
    "t": "Create Amazon Route 53 records, health checks, and latency-based routing policies to route to the ALB."
   },
   {
    "l": "E",
    "t": "Create Amazon Route 53 aliases, health checks, and failover routing policies to route to the ALB."
   },
   {
    "l": "F",
    "t": "Convert the DynamoDB table to a global table."
   }
  ],
  "ans": [
   "C",
   "D",
   "F"
  ],
  "multi": 3,
  "expl": [
   "C: ALBs and Auto Scaling groups are Region-scoped resources, so they must be created separately in the new Region to bring the application tier close to users.",
   "D: Route 53 latency-based routing sends users to the Region with the lowest latency; health checks fail traffic over to the other Region when there is an outage.",
   "F: A DynamoDB global table replicates data across Regions in multi-active mode, allowing reads and writes in both Regions with low latency."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "DynamoDB has no option to create a cross-Region replicated table in that way; the correct feature is a global table."
   },
   {
    "l": "B",
    "t": "ALBs and Auto Scaling groups are not global resources."
   },
   {
    "l": "E",
    "t": "Failover routing only supports active-passive and does not reduce latency for distant users."
   }
  ],
  "remember": "Multi-Region active-active: latency routing + health checks + DynamoDB global table.",
  "note": ""
 },
 {
  "n": 15,
  "title": "DR for FSx for NetApp ONTAP data with a 10-minute RPO",
  "summary": "Application data lives on an FSx for NetApp ONTAP volume; DR in another Region with a 10-minute RPO is required.",
  "stem": "A company discovers that its production environment and disaster recovery (DR) environment are deployed to the same AWS Region. All the production applications run on Amazon EC2 instances and are deployed by AWS CloudFormation. The applications use an Amazon FSx for NetApp ONTAP volume for application storage. No application data resides on the EC2 instances.\n\nA DevOps engineer copies the required AMIs to a new DR Region. The DevOps engineer also updates the CloudFormation code to accept a Region as a parameter. The storage needs to have an RPO of 10 minutes in the DR Region.\n\nWhich solution will meet these requirements?",
  "opts": [
   {
    "l": "A",
    "t": "Create an Amazon S3 bucket in both Regions. Configure S3 Cross-Region Replication (CRR) for the S3 buckets. Create a scheduled AWS Lambda function to copy any new content from the FSx for ONTAP volume to the S3 bucket in the production Region."
   },
   {
    "l": "B",
    "t": "Use AWS Backup to create a backup vault and a custom backup plan that has a 10-minute frequency. Specify the DR Region as the target Region. Assign the EC2 instances in the production Region to the backup plan."
   },
   {
    "l": "C",
    "t": "Create an AWS Lambda function to create snapshots of the instance store volumes that are attached to the EC2 instances. Configure the Lambda function to copy the snapshots to the DR Region and to remove the previous copies. Create an Amazon EventBridge scheduled rule that invokes the Lambda function every 10 minutes."
   },
   {
    "l": "D",
    "t": "Create an FSx for ONTAP instance in the DR Region. Configure a 5-minute schedule for a volume-level NetApp SnapMirror to replicate the volume from the production Region to the DR Region."
   }
  ],
  "ans": [
   "D"
  ],
  "multi": 1,
  "expl": [
   "The data is on FSx, so that volume itself must be replicated to another Region. Create an FSx for ONTAP file system in the DR Region and configure NetApp SnapMirror (volume-level replication) on a 5-minute schedule, which is shorter than 10 minutes and therefore meets the RPO."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "Lambda and S3 CRR is a roundabout approach that cannot guarantee a 10-minute RPO; the Lambda would also copy into a bucket in the production Region, not the DR Region."
   },
   {
    "l": "B",
    "t": "AWS Backup does not support a 10-minute frequency (the minimum is hourly), and assigning EC2 to the plan does not protect data on FSx."
   },
   {
    "l": "C",
    "t": "The data is not on EC2, and instance store cannot be snapshotted that way."
   }
  ],
  "remember": "Minute-level replication of FSx ONTAP = SnapMirror.",
  "note": ""
 },
 {
  "n": 16,
  "title": "Integrate AWS FIS (chaos engineering) into CodePipeline",
  "summary": "An AWS Fault Injection Service experiment must run as a step in CodePipeline.",
  "stem": "A company uses a pipeline in AWS CodePipeline to deploy an application. The company created an AWS Fault Injection Service (AWS FIS) experiment template to test the resiliency of the application. A DevOps engineer needs to integrate the experiment into the pipeline.\n\nWhich solution will meet this requirement?",
  "opts": [
   {
    "l": "A",
    "t": "Configure a new stage in the pipeline that includes an AWS FIS action. Configure the action to reference the AWS FIS experiment template. Grant the pipeline access to start the experiment."
   },
   {
    "l": "B",
    "t": "Create an Amazon EventBridge scheduler. Grant the scheduler permission to start the AWS FIS experiment. Configure a new stage in the pipeline that includes an action to invoke the EventBridge scheduler."
   },
   {
    "l": "C",
    "t": "Create an AWS Lambda function to start the AWS FIS experiment. Grant the Lambda function permission to start the experiment. Create a new stage in the pipeline that has a Lambda action. Set the action to invoke the Lambda function."
   },
   {
    "l": "D",
    "t": "Export the AWS FIS experiment template to an Amazon S3 bucket. Create an AWS CodeBuild unit test project that has a buildspec that starts the AWS FIS experiment. Grant the CodeBuild project access to start the experiment. Configure a new stage in the pipeline that includes an action to run the CodeBuild unit test project."
   }
  ],
  "ans": [
   "C"
  ],
  "multi": 1,
  "expl": [
   "CodePipeline has no dedicated FIS action. The standard integration: a Lambda function calls the FIS StartExperiment API with an experiment template, and you add a stage with a Lambda invoke action to the pipeline. The Lambda function needs permission to start the experiment and report the result back to the pipeline (PutJobSuccessResult/PutJobFailureResult) so the pipeline continues or stops."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "CodePipeline has no \"AWS FIS action\" that references a template directly."
   },
   {
    "l": "B",
    "t": "EventBridge Scheduler runs on a schedule; it is not a CodePipeline action and does not control pipeline flow."
   },
   {
    "l": "D",
    "t": "You can run FIS from CodeBuild, but exporting the template to S3 is unnecessary; Lambda is simpler and the standard approach."
   }
  ],
  "remember": "Custom step in CodePipeline = Lambda invoke action (remember to report the result back to the pipeline).",
  "note": ""
 },
 {
  "n": 17,
  "title": "Continuously check EBS encryption across the whole organization",
  "summary": "EBS volumes must be checked for encryption in every account in the organization (existing and new), and the check must always remain in place.",
  "stem": "A company uses AWS Organizations to manage multiple accounts. Information security policies require that all unencrypted Amazon EBS volumes be marked as non-compliant. A DevOps engineer needs to automatically deploy the solution and ensure that this compliance check is always present.\n\nWhich solution will accomplish this?",
  "opts": [
   {
    "l": "A",
    "t": "Create an AWS CloudFormation template that defines an AWS Inspector rule to check whether EBS encryption is enabled. Save the template to an Amazon S3 bucket that has been shared with all accounts within the company. Update the account creation script pointing to the CloudFormation template in Amazon S3."
   },
   {
    "l": "B",
    "t": "Create an AWS Config organizational rule to check whether EBS encryption is enabled and deploy the rule using the AWS CLI. Create and apply an SCP to prohibit stopping and deleting AWS Config across the organization."
   },
   {
    "l": "C",
    "t": "Create an SCP in Organizations. Set the policy to prevent the launch of Amazon EC2 instances without encryption on the EBS volumes using a conditional expression. Apply the SCP to all AWS accounts. Use Amazon Athena to analyze the AWS CloudTrail output, looking for events that deny an ec2:RunInstances action."
   },
   {
    "l": "D",
    "t": "Deploy an IAM role to all accounts from a single trusted account. Build a pipeline with AWS CodePipeline with a stage in AWS Lambda to assume the IAM role, and list all EBS volumes in the account. Publish a report to Amazon S3."
   }
  ],
  "ans": [
   "B"
  ],
  "multi": 1,
  "expl": [
   "An AWS Config organizational rule using a managed rule that checks EBS encryption (such as encrypted-volumes) is deployed across the entire organization. Unencrypted volumes are flagged non-compliant; new accounts are covered automatically. An SCP that blocks stopping and deleting AWS Config ensures the compliance check is always present and no account can turn it off."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "Inspector scans for vulnerabilities and has no rule for EBS encryption; modifying the account-creation script does not cover existing accounts."
   },
   {
    "l": "C",
    "t": "An SCP only prevents creating unencrypted EBS volumes; it does not flag existing volumes as non-compliant, and Athena over CloudTrail is not continuous compliance checking."
   },
   {
    "l": "D",
    "t": "A pipeline + Lambda + S3 report is a do-it-yourself build, does not automatically flag non-compliance and does not guarantee the check always exists."
   }
  ],
  "remember": "Organization-wide configuration compliance = Config organizational rule + SCP protecting Config.",
  "note": ""
 },
 {
  "n": 18,
  "title": "Find the instance causing more than 50% of errors from embedded metric format logs",
  "summary": "CloudWatch logs are in embedded metric format. DevOps must be alerted when a single instance causes more than 50% of the total errors.",
  "stem": "A DevOps team supports an application that runs on a large number of Amazon EC2 instances in an Auto Scaling group. The DevOps team uses AWS CloudFormation to deploy the EC2 instances. The application recently experienced an issue. A single instance returned errors to a large percentage of requests. The EC2 instance responded as healthy to both Amazon EC2 and Elastic Load Balancing health checks.\n\nThe DevOps team collects application logs in Amazon CloudWatch by using the embedded metric format. The DevOps team needs to receive an alert if any EC2 instance is responsible for more than half of all errors.\n\nWhich combination of steps will meet these requirements with the LEAST operational overhead? (Select TWO.)",
  "opts": [
   {
    "l": "A",
    "t": "Create a CloudWatch Contributor Insights rule that groups logs from the CloudWatch application logs based on instance ID and errors."
   },
   {
    "l": "B",
    "t": "Create a resource group in AWS Resource Groups. Use the CloudFormation stack to group the resources for the application. Add the application to CloudWatch Application Insights. Use the resource group to identify the application."
   },
   {
    "l": "C",
    "t": "Create a metric filter for the application logs to count the occurrence of the term \"Error.\" Create a CloudWatch alarm that uses the METRIC_COUNT function to determine whether errors have occurred. Configure the CloudWatch alarm to send a notification to an Amazon Simple Notification Service (Amazon SNS) topic to notify the DevOps team."
   },
   {
    "l": "D",
    "t": "Create a CloudWatch alarm that uses the INSIGHT_RULE_METRIC function to determine whether a specific instance is responsible for more than half of all errors reported by EC2 instances. Configure the CloudWatch alarm to send a notification to an Amazon Simple Notification Service (Amazon SNS) topic to notify the DevOps team."
   },
   {
    "l": "E",
    "t": "Create a CloudWatch subscription filter for the application logs that filters for errors and invokes an AWS Lambda function. Configure the Lambda function to send the instance ID and error in a notification to an Amazon Simple Notification Service (Amazon SNS) topic to notify the DevOps team."
   }
  ],
  "ans": [
   "A",
   "D"
  ],
  "multi": 2,
  "expl": [
   "A: A Contributor Insights rule groups logs by instance ID and error, showing which instance contributes the most errors, without any extra infrastructure.",
   "D: An alarm uses the INSIGHT_RULE_METRIC function to get data from the rule (such as the top contributor's share) and compare it with total errors; it triggers when one instance causes more than half and sends an SNS notification to DevOps."
  ],
  "wrong": [
   {
    "l": "B",
    "t": "Application Insights monitors applications in general; it does not answer \"one instance accounts for more than 50% of errors\"."
   },
   {
    "l": "C",
    "t": "A metric filter with METRIC_COUNT only counts total errors; it does not identify the instance or compute contribution ratios."
   },
   {
    "l": "E",
    "t": "A subscription filter + Lambda must be built by hand and is much more work to operate."
   }
  ],
  "remember": "\"Who contributes the most\" = Contributor Insights; alarm with INSIGHT_RULE_METRIC.",
  "note": ""
 },
 {
  "n": 19,
  "title": "Protect an audit application's IAM role from modification/deletion organization-wide",
  "summary": "The role used by an audit application must not be modified or deleted by anyone, except a trusted administrator role, in every account.",
  "stem": "A company hosts a security auditing application in an AWS account. The auditing application uses an IAM role to access other AWS accounts. All the accounts are in the same organization in AWS Organizations.\n\nA recent security audit revealed that users in the audited AWS accounts could modify or delete the auditing application's IAM role. The company needs to prevent any modification to the auditing application's IAM role by any entity other than a trusted administrator IAM role.\n\nWhich solution will meet these requirements?",
  "opts": [
   {
    "l": "A",
    "t": "Create an SCP that includes a Deny statement for changes to the auditing application's IAM role. Include a condition that allows the trusted administrator IAM role to make changes. Attach the SCP to the root of the organization."
   },
   {
    "l": "B",
    "t": "Create an SCP that includes an Allow statement for changes to the auditing application's IAM role by the trusted administrator IAM role. Include a Deny statement for changes by all other IAM principals. Attach the SCP to the IAM service in each AWS account where the auditing application has an IAM role."
   },
   {
    "l": "C",
    "t": "Create an IAM permissions boundary that includes a Deny statement for changes to the auditing application's IAM role. Include a condition that allows the trusted administrator IAM role to make changes. Attach the permissions boundary to the audited AWS accounts."
   },
   {
    "l": "D",
    "t": "Create an IAM permissions boundary that includes a Deny statement for changes to the auditing application's IAM role. Include a condition that allows the trusted administrator IAM role to make changes. Attach the permissions boundary to the auditing application's IAM role in the AWS accounts."
   }
  ],
  "ans": [
   "A"
  ],
  "multi": 1,
  "expl": [
   "The standard approach is an SCP attached at the root with a Deny statement for role-changing actions (iam:DeleteRole, iam:PutRolePolicy, iam:UpdateAssumeRolePolicy, ...) plus an exception condition (for example aws:PrincipalArn) for the administrator role only. An SCP applies to every account, so it blocks even each account's own admins."
  ],
  "wrong": [
   {
    "l": "B",
    "t": "An SCP cannot be attached to an individual IAM role; an Allow in an SCP only sets a maximum boundary and does not grant permissions."
   },
   {
    "l": "C and D",
    "t": "A permissions boundary is attached to each individual user/role, is not centrally managed, and anyone with IAM permissions can still remove the boundary."
   }
  ],
  "remember": "Protecting a resource organization-wide = SCP Deny + exception condition on PrincipalArn.",
  "note": ""
 },
 {
  "n": 20,
  "title": "Analyze CSV logs on S3: visualization and persistent metadata",
  "summary": "CSV-format log data on S3 must be queried and visualized, with metadata stored durably.",
  "stem": "A company is storing 100 GB of log data in .csv format in an Amazon S3 bucket. SQL developers want to query this data and generate graphs to visualize it. The SQL developers also need an efficient, automated way to store metadata from the .csv file.\n\nWhich combination of steps will meet these requirements with the LEAST amount of effort? (Select THREE.)",
  "opts": [
   {
    "l": "A",
    "t": "Filter the data through AWS X-Ray to visualize the data."
   },
   {
    "l": "B",
    "t": "Filter the data through Amazon QuickSight to visualize the data."
   },
   {
    "l": "C",
    "t": "Query the data with Amazon Athena."
   },
   {
    "l": "D",
    "t": "Query the data with Amazon Redshift."
   },
   {
    "l": "E",
    "t": "Use the AWS Glue Data Catalog as the persistent metadata store."
   },
   {
    "l": "F",
    "t": "Use Amazon DynamoDB as the persistent metadata store."
   }
  ],
  "ans": [
   "B",
   "C",
   "E"
  ],
  "multi": 3,
  "expl": [
   "B – QuickSight: a BI service that builds charts/dashboards and connects directly to Athena. C – Athena: queries CSV files directly on S3 with SQL; serverless, no need to load the data. E – Glue Data Catalog: stores metadata (schemas, tables); a Glue crawler scans the CSV files to create tables, and Athena uses this catalog directly."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "X-Ray traces application requests; it is not used to visualize CSV logs."
   },
   {
    "l": "D",
    "t": "Redshift requires creating a cluster and loading data, which is more effort than Athena for this need."
   },
   {
    "l": "F",
    "t": "DynamoDB is not the standard place to store metadata for Athena."
   }
  ],
  "remember": "Serverless S3 analytics trio: Glue Catalog + Athena + QuickSight.",
  "note": ""
 },
 {
  "n": 21,
  "title": "Global DNS routing: low latency and fault tolerance",
  "summary": "An application has endpoints in multiple Regions; routing must give global users low latency and fail over automatically when a Region fails.",
  "stem": "A global media streaming company uses Amazon Route 53 to route traffic to an application endpoint. The company is updating the application to run globally across multiple AWS Regions. The company must ensure high availability, fault tolerance, and low latency for users.\n\nWhich solution will meet these requirements?",
  "opts": [
   {
    "l": "A",
    "t": "Configure Route 53 health checks for each Regional endpoint. Set up latency-based routing with failover to healthy endpoints. Use a Route 53 Traffic Flow policy to define the routing."
   },
   {
    "l": "B",
    "t": "Implement Route 53 geolocation routing with weighted records for each Region. Use Amazon Application Recovery Controller to automatically failover between Regions when required."
   },
   {
    "l": "C",
    "t": "Set up Route 53 multivalue answer routing with health checks for each endpoint. Use Route 53 Resolver to forward DNS queries to on-premises DNS servers to make local routing decisions."
   },
   {
    "l": "D",
    "t": "Configure Route 53 geoproximity routing with bias values for each Region. Use AWS Transit Gateway to establish inter-Region VPC connectivity. Create and share a Route 53 private hosted zone."
   }
  ],
  "ans": [
   "A"
  ],
  "multi": 1,
  "expl": [
   "Latency-based routing sends users to the Region with the lowest latency. Health checks on each Regional endpoint detect failed endpoints and Route 53 switches to a healthy one. A Traffic Flow policy combines these rules into a single policy."
  ],
  "wrong": [
   {
    "l": "B",
    "t": "Geolocation is based on geographic location and does not optimize latency; Application Recovery Controller is complex and unnecessary."
   },
   {
    "l": "C",
    "t": "Multivalue answer returns healthy IPs at random and does not optimize latency; a Resolver that forwards on-premises DNS is unrelated."
   },
   {
    "l": "D",
    "t": "Geoproximity with a bias does not optimize real network latency; Transit Gateway and a private hosted zone are for internal networks."
   }
  ],
  "remember": "Low latency = latency routing; fault tolerance = health checks.",
  "note": ""
 },
 {
  "n": 22,
  "title": "SCP: keep FullAWSAccess at the root and block IAM in the production OU",
  "summary": "Only the production OU must be blocked from managing IAM roles/policies, except for one management IAM role; the development OU must be unaffected and users must still be able to deploy applications.",
  "stem": "A company has an AWS Control Tower landing zone. The company's DevOps team creates a workload OU. A development OU and a production OU are nested under the workload OU. The company grants users full access to the company's AWS accounts to deploy applications.\n\nThe DevOps team needs to allow only a specific management IAM role to manage the IAM roles and policies of any AWS accounts in only the production OU.\n\nWhich combination of steps will meet these requirements? (Select TWO.)",
  "opts": [
   {
    "l": "A",
    "t": "Create an SCP that denies full access with a condition to exclude the management IAM role for the organization root."
   },
   {
    "l": "B",
    "t": "Ensure that the FullAWSAccess SCP is applied at the organization root."
   },
   {
    "l": "C",
    "t": "Create an SCP that allows IAM related actions. Attach the SCP to the development OU."
   },
   {
    "l": "D",
    "t": "Create an SCP that denies IAM related actions with a condition to exclude the management IAM role. Attach the SCP to the workload OU."
   },
   {
    "l": "E",
    "t": "Create an SCP that denies IAM related actions with a condition to exclude the management IAM role. Attach the SCP to the production OU."
   }
  ],
  "ans": [
   "B",
   "E"
  ],
  "multi": 2,
  "expl": [
   "B: SCPs set a maximum boundary, so you need to keep an Allow SCP (FullAWSAccess) at the root so accounts have permissions; without it, every action is implicitly denied.",
   "E: An SCP that Denies IAM actions, excluding the management IAM role, attached to the production OU: it blocks all other principals from managing IAM there without affecting the development OU."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "Denying all permissions at the root (except the management role) would lock out every user and is far too broad."
   },
   {
    "l": "C",
    "t": "An Allow in an SCP adds no restriction and does not solve the requirement to block IAM in the production OU."
   },
   {
    "l": "D",
    "t": "Attaching it to a workload OU would also block the development OU, while the requirement only applies to production."
   }
  ],
  "remember": "Target the Deny at the right OU + keep the Allow at the root. Don't deny at the root if only one OU needs it.",
  "note": ""
 },
 {
  "n": 23,
  "title": "Lambda: safe canary deployment with automatic rollback",
  "summary": "Lambda must be deployed safely, reducing impact when the new version is faulty, with monitoring and automatic rollback.",
  "stem": "A DevOps engineer is building a continuous deployment pipeline for a serverless application that uses AWS Lambda functions. The company wants to reduce the customer impact of an unsuccessful deployment. The company also wants to monitor for issues.\n\nWhich deploy stage configuration will meet these requirements?",
  "opts": [
   {
    "l": "A",
    "t": "Use an AWS Serverless Application Model (AWS SAM) template to define the serverless application. Use AWS CodeDeploy to deploy the Lambda functions with the Canary10Percent15Minutes Deployment Preference Type. Use Amazon CloudWatch alarms to monitor the health of the functions."
   },
   {
    "l": "B",
    "t": "Use AWS CloudFormation to publish a new stack update, and include Amazon CloudWatch alarms on all resources. Set up an AWS CodePipeline approval action for a developer to verify and approve the AWS CloudFormation change set."
   },
   {
    "l": "C",
    "t": "Use AWS CloudFormation to publish a new version on every stack update, and include Amazon CloudWatch alarms on all resources. Use the RoutingConfig property of the AWS::Lambda::Alias resource to update the traffic routing during the stack update."
   },
   {
    "l": "D",
    "t": "Use AWS CodeBuild to add sample event payloads for testing to the Lambda functions. Publish a new version of the functions, and include Amazon CloudWatch alarms. Update the production alias to point to the new version. Configure rollbacks to occur when an alarm is in the ALARM state."
   }
  ],
  "ans": [
   "A"
  ],
  "multi": 1,
  "expl": [
   "AWS SAM combined with CodeDeploy: the Canary10Percent15Minutes deployment preference shifts 10% of traffic to the new version, watches for 15 minutes, and only then shifts 100%. CodeDeploy monitors CloudWatch alarms during the deployment and automatically rolls back when an alarm fires."
  ],
  "wrong": [
   {
    "l": "B",
    "t": "Manually approving a change set does not reduce impact on failure and has no gradual traffic shifting or automatic rollback."
   },
   {
    "l": "C",
    "t": "An alias RoutingConfig can split traffic, but you would have to manage the gradual shift and rollback yourself."
   },
   {
    "l": "D",
    "t": "CodeBuild only builds/tests; updating the production alias to the new version shifts 100% of traffic at once."
   }
  ],
  "remember": "Lambda + SAM DeploymentPreference + alarm = canary/linear with automatic rollback.",
  "note": ""
 },
 {
  "n": 24,
  "title": "Track installed applications and their change history, retained for 7 years",
  "summary": "The list of applications installed on on-premises servers and EC2 instances must be collected, changes tracked over time, and the data retained for 7 years.",
  "stem": "A DevOps engineer needs a solution to catalog all applications that are installed on on-premises servers and Amazon EC2 instances. The solution must track historical changes and retain the data for 7 years.\n\nWhich solution will meet these requirements with the LEAST operational overhead?",
  "opts": [
   {
    "l": "A",
    "t": "Install the AWS Systems Manager Agent (SSM Agent) on the on-premises servers and the EC2 instances. Use Systems Manager Inventory to collect inventory data. Set the retention period for the inventory data to 7 years."
   },
   {
    "l": "B",
    "t": "Install AWS Systems Manager Agent (SSM Agent) on the on-premises servers and the EC2 instances. Use Systems Manager Inventory to collect inventory data. Use a Systems Manager resource data sync to send inventory data from all the managed nodes to a single Amazon S3 bucket. Set an object lifecycle rule to delete objects after 7 years."
   },
   {
    "l": "C",
    "t": "Install the AWS Systems Manager Agent (SSM Agent) on the on-premises servers and the EC2 instances. Use Systems Manager Inventory to collect inventory data. Use AWS Config to capture history and track changes. Set the retention period for the AWS Config data to 7 years."
   },
   {
    "l": "D",
    "t": "Configure an Amazon S3 bucket with an object lifecycle rule that deletes objects after 7 years. Create a custom script to collect inventory data from the on-premises servers and the EC2 instances. Configure the script to send the inventory data to the S3 bucket. Configure an IAM role for the EC2 instances and IAM Roles Anywhere for the on-premises servers with appropriate permissions."
   }
  ],
  "ans": [
   "C"
  ],
  "multi": 1,
  "expl": [
   "The SSM Agent and Systems Manager Inventory collect the application list automatically for both on-premises and EC2, but Inventory only stores the current state, not history. AWS Config records the configuration and change history of the inventory data (the AWS::SSM::ManagedInstanceInventory resource). Set the Config retention period to 7 years (maximum 2557 days) to meet the retention requirement."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "Inventory has no 7-year retention setting and does not track change history."
   },
   {
    "l": "B",
    "t": "A resource data sync to S3 plus a lifecycle rule takes extra effort; it is not a change-tracking mechanism like Config, and the lifecycle rule would also delete the data after 7 years."
   },
   {
    "l": "D",
    "t": "Custom scripts and IAM Roles Anywhere are do-it-yourself and the most operationally expensive."
   }
  ],
  "remember": "Inventory = current state; AWS Config = change history (retention up to 7 years).",
  "note": ""
 },
 {
  "n": 25,
  "title": "Limit IAM permissions for roles created by AWS CDK",
  "summary": "Developers using CDK can create roles with excessive permissions. The maximum permissions of every role CDK creates (including Lambda roles) must be capped without touching each role individually.",
  "stem": "A company uses an AWS Cloud Development Kit (AWS CDK) application for its infrastructure. The AWS CDK application creates AWS Lambda functions and the IAM roles that are attached to the functions. The company also uses AWS Organizations. The company's developers can assume the AWS CDK application deployment role.\n\nThe company's security team discovered that the developers and the role used to deploy the AWS CDK application have more permissions than necessary. The security team also discovered that the roles attached to the Lambda functions that the CDK application creates have more permissions than necessary. The developers must not have the ability to grant additional permissions.\n\nWhich solution will meet these requirements with the LEAST operational overhead?",
  "opts": [
   {
    "l": "A",
    "t": "Create an SCP that denies the iam:CreateRole action and the iam:UpdateRole action for the developer role and the AWS CDK application deployment role. Centrally create new IAM roles to attach to the Lambda functions for the developers to use to provision Lambda functions."
   },
   {
    "l": "B",
    "t": "Create an IAM permission boundary policy. Define the maximum actions that the AWS CDK application requires in the policy. Update the account's AWS CDK bootstrapping to use the permission boundary. Update the configuration in the AWS CDK application for the default permissions boundary to use the policy."
   },
   {
    "l": "C",
    "t": "Create an IAM permission boundary policy. Define the maximum actions that the AWS CDK application requires in the policy. Instruct the developers to use the permission boundary policy name when they create a role in the AWS CDK application code."
   },
   {
    "l": "D",
    "t": "Create an SCP that denies the iam:CreateRole action and the iam:UpdateRole action for the developer role. Give the AWS CDK deployment role access to create roles associated with Lambda functions. Run AWS Identity and Access Management Access Analyzer to verify that the Lambda functions role does not have permissions."
   }
  ],
  "ans": [
   "B"
  ],
  "multi": 1,
  "expl": [
   "A permissions boundary sets a ceiling on permissions. Combining CDK bootstrapping with a custom permissions boundary (--custom-permissions-boundary) applies the boundary to deployment roles and the roles that CDK creates. Define the boundary policy with only the actions the application really needs; developers cannot grant permissions above the ceiling and no manual intervention is needed."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "Blocking CreateRole/UpdateRole and creating roles centrally for developers is a manual process and obstructs CDK from creating its own roles."
   },
   {
    "l": "C",
    "t": "Relies on developers remembering to attach the boundary in code, which is not enforced."
   },
   {
    "l": "D",
    "t": "Blocking role creation and using Access Analyzer only detects problems afterwards; it does not prevent excessive permissions."
   }
  ],
  "remember": "Permission ceiling for IaC-created roles = permissions boundary enforced through CDK bootstrap.",
  "note": ""
 },
 {
  "n": 26,
  "title": "Lambda throttled during predictable peak hours",
  "summary": "A REST API backed by Lambda is throttled during fixed peak time windows even though total requests are within the account quota; responses must still be returned directly to users.",
  "stem": "A DevOps engineer is developing an application that uses an Amazon API Gateway REST API and a backend based on several AWS Lambda functions. The API returns responses from the Lambda functions to end users.\n\nThe application receives large bursts of requests at predictable times every day. During load testing, the DevOps engineer discovers that many of the incoming requests are throttled at the backend. The throttling occurs even though the total number of requests are well within the account quota for concurrent executions. Each Lambda function takes a little over 1 second to run on an average. The DevOps engineer has set the Lambda function timeout to 4 seconds. There are other Lambda functions in the same AWS account.\n\nThe DevOps engineer needs a solution to reduce the Lambda function throttling issues.\n\nWhich solution will meet this requirement?",
  "opts": [
   {
    "l": "A",
    "t": "Set an Amazon Simple Queue Service (Amazon SQS) queue as an integration target for the REST API. Set the SQS queue as the event source for the Lambda functions. Update the functions to remove each event from the queue after a function successfully processes the event."
   },
   {
    "l": "B",
    "t": "Increase the memory allocation for the Lambda functions. Migrate runtime dependencies to a Lambda layer. Associate the layer with the functions."
   },
   {
    "l": "C",
    "t": "Create a Docker-based custom runtime for the Lambda functions. Store the Docker image in an Amazon Elastic Container Registry (Amazon ECR) repository. Configure the Lambda functions to use the new runtime and configure SnapStart."
   },
   {
    "l": "D",
    "t": "Configure an AWS Application Auto Scaling policy to manage the reserved and provisioned concurrency for the Lambda functions. Configure the policy to handle scaling during the times of day when the bursts of events occur."
   }
  ],
  "ans": [
   "D"
  ],
  "multi": 1,
  "expl": [
   "Throttling happens because, at the moment of the burst, the function does not have enough concurrency ready (cold starts and scaling rate are limited). Since the peak hours are predictable, use scheduled Application Auto Scaling to manage provisioned concurrency so environments are prepared before the burst. Reserved concurrency guarantees the function its own share of concurrency so other Lambda functions in the account cannot consume it all."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "With SQS as a queue, the REST API can no longer return results directly to users."
   },
   {
    "l": "B",
    "t": "Increasing memory and using layers does not address the concurrency limit during a burst."
   },
   {
    "l": "C",
    "t": "A custom Docker runtime and SnapStart do not solve throttling; SnapStart also does not support container images."
   }
  ],
  "remember": "Scheduled burst = scheduled scaling of provisioned concurrency.",
  "note": ""
 },
 {
  "n": 27,
  "title": "Rotating secrets and encrypting CodeBuild output with KMS",
  "summary": "A pipeline must store external API credentials, rotate them automatically every month, and encrypt the build output with a KMS key.",
  "stem": "A company in a highly regulated industry is building an artifact by using AWS CodeBuild and AWS CodePipeline. The company must connect to an external authenticated API during the building process.\n\nThe company's DevOps engineer needs to encrypt the build outputs by using an AWS Key Management Service (AWS KMS) key. The external API credentials must be reset each month. The DevOps engineer has created a new key in AWS KMS.\n\nWhich solution will meet these requirements?",
  "opts": [
   {
    "l": "A",
    "t": "Store the API credentials in AWS Systems Manager Parameter Store. Update the key policy for the CodeBuild IAM service role to have access to the KMS key. Set CODEBUILD_KMS_KEY_ID as the new key ID."
   },
   {
    "l": "B",
    "t": "Store the API credentials in AWS Systems Manager Parameter Store. Update the key policy for the CodePipeline IAM service role to have access to the KMS key. Add the key to the pipeline."
   },
   {
    "l": "C",
    "t": "Store the API credentials in AWS Secrets Manager. Update the key policy for the CodeBuild IAM service role to have access to the KMS key. Set CODEBUILD_KMS_KEY_ID as the new key ID."
   },
   {
    "l": "D",
    "t": "Store the API credentials in AWS Secrets Manager. Update the key policy for the CodePipeline IAM service role to have access to the KMS key. Add the key to the pipeline."
   }
  ],
  "ans": [
   "C"
  ],
  "multi": 1,
  "expl": [
   "Secrets Manager supports automatic rotation (Parameter Store has no built-in rotation), which meets the monthly reset requirement. CODEBUILD_KMS_KEY_ID specifies the KMS key used to encrypt CodeBuild output; the CodeBuild service role must be granted permission to use that key (via the key policy)."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "Parameter Store has no automatic rotation."
   },
   {
    "l": "B",
    "t": "Also uses Parameter Store, and assigning the key to CodePipeline is not how CodeBuild output encryption is configured."
   },
   {
    "l": "D",
    "t": "Secrets Manager is correct, but granting the CodePipeline service role access and \"adding the key to the pipeline\" is not the mechanism for setting the KMS key for CodeBuild build output."
   }
  ],
  "remember": "Automatic rotation = Secrets Manager. KMS for CodeBuild output = CODEBUILD_KMS_KEY_ID + permission for the service role.",
  "note": ""
 },
 {
  "n": 28,
  "title": "SCP to block the root user in member accounts (note: answer options not fully visible)",
  "summary": "An SCP is needed to block all actions by the root user in member accounts. The screenshot only shows options up to B; C and D are not visible.",
  "stem": "A company manages multiple AWS accounts in AWS Organizations. The company's security policy states that AWS account root user credentials for member accounts must not be used. The company monitors access to the root user credentials.\n\nA recent alert shows that the root user in a member account launched an Amazon EC2 instance. A DevOps engineer must create an SCP at the organization's root level that will prevent the root user in member accounts from making any AWS service API calls.\n\nWhich SCP will meet these requirements?",
  "opts": [
   {
    "l": "A",
    "t": "```json\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": \"*\",\n      \"Resource\": \"*\",\n      \"Condition\": {\n        \"StringNotLike\": { \"aws:PrincipalArn\": \"arn:aws:iam::*:root\" }\n      }\n    }\n  ]\n}\n```"
   },
   {
    "l": "B",
    "t": "```json\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Effect\": \"Deny\",\n      \"Action\": \"*\",\n      \"Resource\": \"*\",\n      \"Principal\": { \"AWS\": \"arn:aws:iam::*:root\" }\n    }\n    ...\n```"
   }
  ],
  "ans": [],
  "multi": 0,
  "expl": [
   "The correct SCP has this form: Effect Deny, Action *, Resource *, Condition StringLike with aws:PrincipalArn set to arn:aws:iam::*:root. Deny always wins over Allow and the condition targets exactly the root user of every member account. Pick whichever of option C or D has Deny + StringLike + aws:PrincipalArn as above."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "Uses Allow with StringNotLike: an Allow-type SCP only sets a maximum boundary and does not actively block root, and if FullAWSAccess is still attached, root can still call APIs."
   },
   {
    "l": "B",
    "t": "SCPs do not support the Principal element, so the policy is invalid."
   }
  ],
  "remember": "Block the root user with an SCP: Deny + an aws:PrincipalArn condition matching :root.",
  "note": "Ảnh đề gốc bị cắt sau lựa chọn B nên không xác định được đáp án đúng. Câu này không được tính điểm; xem phần giải thích để biết dạng SCP đúng.",
  "ungraded": true
 },
 {
  "n": 29,
  "title": "Deploy AWS Config rules at scale and prevent member accounts from changing/deleting them",
  "summary": "A baseline of AWS Config rules and remediation must be deployed across the organization from the delegated administrator account; ordinary users in member accounts must not be able to modify or delete them.",
  "stem": "A company is using AWS Organizations to centrally manage its AWS accounts. The company has turned on AWS Config in each member account by using AWS CloudFormation StackSets. The company has configured trusted access in Organizations for AWS Config and has configured a member account as a delegated administrator account for AWS Config.\n\nA DevOps engineer needs to implement a new security policy. The policy must require all current and future AWS member accounts to use a common baseline of AWS Config rules that contain remediation actions that are managed from a central account. Non-administrator users who can access member accounts must not be able to modify this common baseline of AWS Config rules that are deployed into each member account.\n\nWhich solution will meet these requirements?",
  "opts": [
   {
    "l": "A",
    "t": "Create a CloudFormation template that contains the AWS Config rules and remediation actions. Deploy the template from the Organizations management account by using CloudFormation StackSets."
   },
   {
    "l": "B",
    "t": "Create an AWS Config conformance pack that contains the AWS Config rules and remediation actions. Deploy the pack from the Organizations management account by using CloudFormation StackSets."
   },
   {
    "l": "C",
    "t": "Create a CloudFormation template that contains the AWS Config rules and remediation actions. Deploy the template from the delegated administrator account by using AWS Config."
   },
   {
    "l": "D",
    "t": "Create an AWS Config conformance pack that contains the AWS Config rules and remediation actions. Deploy the pack from the delegated administrator account by using AWS Config."
   }
  ],
  "ans": [
   "D"
  ],
  "multi": 1,
  "expl": [
   "An organization conformance pack is a package of Config rules and remediation actions deployed from a central account to the whole organization; new accounts receive it automatically. Deploy directly through AWS Config from the delegated administrator (with trusted access enabled). Rules created by an organization conformance pack cannot be modified or deleted by non-admin users in member accounts."
  ],
  "wrong": [
   {
    "l": "A and C",
    "t": "Deploying with CloudFormation creates ordinary rules inside each member account, so users with permissions can still modify them."
   },
   {
    "l": "B",
    "t": "Conformance packs are not deployed through StackSets like this but through the AWS Config API (organization conformance pack); a delegated administrator already exists, so the management account is not needed."
   }
  ],
  "remember": "Organization-wide Config baseline that cannot be altered = organization conformance pack.",
  "note": ""
 },
 {
  "n": 30,
  "title": "CodePipeline deploys to ECS and runs post-deployment checks",
  "summary": "A pipeline builds an image and deploys it to a test ECS cluster, then verifies connectivity and calls the service's API, with the least management effort.",
  "stem": "A DevOps engineer needs to implement integration tests into an existing AWS CodePipeline CI/CD workflow for an Amazon Elastic Container Service (Amazon ECS) service. The CI/CD workflow retrieves new application code from a Git repository and builds a container image. The CI/CD workflow then uploads the container image to Amazon Elastic Container Registry (Amazon ECR) with a new image tag version.\n\nThe integration tests must ensure that new versions of the service endpoint are reachable and that various API methods return successful response data. The DevOps engineer has already created an ECS cluster to test the service.\n\nWhich combination of steps will meet these requirements with the LEAST management overhead? (Select THREE.)",
  "opts": [
   {
    "l": "A",
    "t": "Add a deploy stage to the pipeline. Configure Amazon ECS as the action provider."
   },
   {
    "l": "B",
    "t": "Add a deploy stage to the pipeline. Configure AWS CodeDeploy as the action provider."
   },
   {
    "l": "C",
    "t": "Add an appspec.yml file to the Git repository."
   },
   {
    "l": "D",
    "t": "Update the image build pipeline stage to output an imagedefinitions.json file that references the new image tag."
   },
   {
    "l": "E",
    "t": "Create an AWS Lambda function that runs connectivity checks and API calls against the service. Integrate the Lambda function with CodePipeline by using a Lambda action stage."
   },
   {
    "l": "F",
    "t": "Write a script that runs integration tests against the service. Upload the script to an Amazon S3 bucket. Integrate the script in the S3 bucket with CodePipeline by using an S3 action stage."
   }
  ],
  "ans": [
   "A",
   "D",
   "E"
  ],
  "multi": 3,
  "expl": [
   "A: A Deploy stage with Amazon ECS as the action provider deploys the new image directly (standard deploy), which is simpler than CodeDeploy blue/green.",
   "D: The ECS deploy action needs an imagedefinitions.json file (container name and image URI with the new tag) produced by the build stage.",
   "E: A Lambda action runs connectivity/API-call checks after deployment and reports the result back to the pipeline."
  ],
  "wrong": [
   {
    "l": "B and C",
    "t": "CodeDeploy with appspec.yml is used for blue/green on ECS, which is more complex than needed."
   },
   {
    "l": "F",
    "t": "CodePipeline does not run scripts through an S3 action; the S3 action is only for fetching or pushing artifacts."
   }
  ],
  "remember": "ECS standard deploy needs imagedefinitions.json; CodeDeploy needs appspec + task definition.",
  "note": ""
 },
 {
  "n": 31,
  "title": "EKS: automatically scale Pods on CPU and add nodes when resources run out",
  "summary": "An EKS cluster already has Metrics Server installed; Pods must scale automatically based on CPU and nodes must be added when resources run out.",
  "stem": "A DevOps team is deploying microservices for an application on an Amazon Elastic Kubernetes Service (Amazon EKS) cluster. The cluster uses managed node groups.\n\nThe DevOps team wants to enable auto scaling for the microservice Pods based on a specific CPU utilization percentage. The DevOps team has already installed the Kubernetes Metrics Server on the cluster.\n\nWhich solution will meet these requirements in the MOST operationally efficient way?",
  "opts": [
   {
    "l": "A",
    "t": "Edit the Auto Scaling group that is associated with the worker nodes of the EKS cluster. Configure the Auto Scaling group to use a target tracking scaling policy to scale when the average CPU utilization of the Auto Scaling group reaches a specific percentage."
   },
   {
    "l": "B",
    "t": "Deploy the Kubernetes Horizontal Pod Autoscaler (HPA) and the Kubernetes Vertical Pod Autoscaler (VPA) in the cluster. Configure the HPA to scale based on the target CPU utilization percentage. Configure the VPA to use the recommender mode setting."
   },
   {
    "l": "C",
    "t": "Run the AWS Systems Manager AWS-UpdateEKSManagedNodeGroup Automation document. Modify the values for NodeGroupDesiredSize, NodeGroupMaxSize, and NodeGroupMinSize to be based on an estimate for the required node size."
   },
   {
    "l": "D",
    "t": "Deploy the Kubernetes Horizontal Pod Autoscaler (HPA) and the Kubernetes Cluster Autoscaler in the cluster. Configure the HPA to scale based on the target CPU utilization percentage. Configure the Cluster Autoscaler to use the auto-discovery setting."
   }
  ],
  "ans": [
   "D"
  ],
  "multi": 1,
  "expl": [
   "The Horizontal Pod Autoscaler (HPA) uses metrics from Metrics Server and adds Pods when CPU exceeds the target. When Pods increase and the nodes are full, Cluster Autoscaler (auto-discovery) automatically adds nodes to the managed node group when there are unschedulable Pods. Together they form a complete scaling solution."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "Scaling the ASG on node CPU does not scale Pods to a target CPU; editing the managed node group's ASG directly is not the standard approach."
   },
   {
    "l": "B",
    "t": "VPA in recommender mode only provides request/limit recommendations; it does not add Pods or nodes."
   },
   {
    "l": "C",
    "t": "An Automation document with estimated node sizes is manual and does not follow actual load."
   }
  ],
  "remember": "Pods: HPA. Nodes: Cluster Autoscaler (or Karpenter).",
  "note": ""
 },
 {
  "n": 32,
  "title": "Automatically attach a WAF web ACL to new ALBs and API Gateway APIs in the organization",
  "summary": "The organization has hundreds of accounts; every ALB and API Gateway API (including newly created resources) must have an AWS WAF web ACL attached.",
  "stem": "A company's security team requires that all external Application Load Balancers (ALBs) and Amazon API Gateway APIs are associated with AWS WAF web ACLs. The company has hundreds of AWS accounts, all of which are included in a single organization in AWS Organizations. The company has configured AWS Config for the organization. During an audit, the company finds some externally facing ALBs that are not associated with AWS WAF web ACLs.\n\nWhich combination of steps should a DevOps engineer take to prevent future violations? (Select TWO.)",
  "opts": [
   {
    "l": "A",
    "t": "Delegate AWS Firewall Manager to a security account."
   },
   {
    "l": "B",
    "t": "Delegate Amazon GuardDuty to a security account."
   },
   {
    "l": "C",
    "t": "Create an AWS Firewall Manager policy to attach AWS WAF web ACLs to any newly created ALBs and API Gateway APIs."
   },
   {
    "l": "D",
    "t": "Create an Amazon GuardDuty policy to attach AWS WAF web ACLs to any newly created ALBs and API Gateway APIs."
   },
   {
    "l": "E",
    "t": "Configure an AWS Config managed rule to attach AWS WAF web ACLs to any newly created ALBs and API Gateway APIs."
   }
  ],
  "ans": [
   "A",
   "C"
  ],
  "multi": 2,
  "expl": [
   "A: Firewall Manager must be managed centrally: the management account designates a delegated administrator (security account). A prerequisite is that AWS Config is enabled in the organization.",
   "C: A Firewall Manager WAF policy automatically applies to existing and new resources in every in-scope account, and automatically attaches the web ACL to non-compliant ALBs/APIs."
  ],
  "wrong": [
   {
    "l": "B and D",
    "t": "GuardDuty is a threat-detection service and has no policy for attaching a WAF web ACL."
   },
   {
    "l": "E",
    "t": "A Config managed rule such as alb-waf-enabled only evaluates and reports compliance; it does not attach a web ACL at organization scale."
   }
  ],
  "remember": "Enforce WAF/Shield/security groups organization-wide = AWS Firewall Manager + Config.",
  "note": ""
 },
 {
  "n": 33,
  "title": "Share CDK constructs and automatically apply new releases to many applications",
  "summary": "Shared CDK constructs must be released using semantic versioning, and each new release must be applied immediately to every application.",
  "stem": "A DevOps engineer at a company maintains a Git repository that contains AWS Cloud Development Kit (AWS CDK) constructs that are written in TypeScript. Many of the company's applications use the AWS CDK constructs.\n\nThe company uses AWS CodePipeline, AWS CodeBuild, and AWS CodeDeploy. The company used AWS CodeConnections to set up its Git source code provider. Each application has its own Git repository configured as a source action within the application's pipeline.\n\nThe DevOps engineer must ensure that new releases to the AWS CDK constructs that are qualified for use in production are immediately made available across all applications. The company uses semantic versioning to assign version numbers to releases that can be used in production.\n\nWhich solution will meet these requirements?",
  "opts": [
   {
    "l": "A",
    "t": "Add a source action to the main branch of the AWS CDK constructs Git repository in each application's pipeline. Ensure that the pipelines have the necessary permissions to clone the AWS CDK constructs Git repository."
   },
   {
    "l": "B",
    "t": "Publish each new release as a package to an AWS CodeArtifact npm repository. Add a dependency to the npm repository package in all application projects. Create Amazon EventBridge rules that invoke the application pipelines when a new release is published to CodeArtifact."
   },
   {
    "l": "C",
    "t": "Add the AWS CDK constructs repository as a Git submodule in the Git repositories of the applications. Ensure that the application pipelines have the necessary permissions to clone the AWS CDK constructs Git repository. Schedule the pipeline for each application to run every 24 hours."
   },
   {
    "l": "D",
    "t": "Publish each new release as a package to an AWS CodeArtifact npm repository. Add a dependency to the npm repository package in all application projects. Add a command in CodeBuild to log in to the CodeArtifact repository in the PRE_BUILD phase."
   }
  ],
  "ans": [
   "B"
  ],
  "multi": 1,
  "expl": [
   "Publish each release to a CodeArtifact npm repository: a managed package repository that supports semantic versioning, and applications simply declare an npm dependency. CodeArtifact emits an event when a package version is published. An EventBridge rule captures this event and triggers each application's pipeline, so the new release is applied immediately."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "Pulling the main branch does not guarantee the code is production-ready and provides no semantic versioning."
   },
   {
    "l": "C",
    "t": "A Git submodule on a 24-hour schedule does not meet \"immediately\" and also pulls unreleased code."
   },
   {
    "l": "D",
    "t": "Using CodeArtifact is the right direction, but the pipeline only runs when the application changes; there is no trigger when a new release is published."
   }
  ],
  "remember": "Versioned internal packages = CodeArtifact; trigger on release = EventBridge (package version state change).",
  "note": ""
 },
 {
  "n": 34,
  "title": "Order-processing latency: SQS, Lambda and DynamoDB",
  "summary": "Order updates are slow: messages wait a long time in SQS and DynamoDB writes are slow. Lambda uses reserved concurrency and the table uses auto scaling.",
  "stem": "An ecommerce company is receiving reports that its order history page is experiencing delays in reflecting the processing status of orders. The order processing system consists of an AWS Lambda function that uses reserved concurrency. The Lambda function processes order messages from an Amazon Simple Queue Service (Amazon SQS) queue and inserts processed orders into an Amazon DynamoDB table. The DynamoDB table has auto scaling enabled for read and write capacity.\n\nWhich actions should a DevOps engineer take to resolve this delay? (Select TWO.)",
  "opts": [
   {
    "l": "A",
    "t": "Check the ApproximateAgeOfOldestMessage metric for the SQS queue. Increase the Lambda function concurrency limit."
   },
   {
    "l": "B",
    "t": "Check the ApproximateAgeOfOldestMessage metric for the SQS queue. Configure a redrive policy on the SQS queue."
   },
   {
    "l": "C",
    "t": "Check the NumberOfMessagesSent metric for the SQS queue. Increase the SQS queue visibility timeout."
   },
   {
    "l": "D",
    "t": "Check the WriteThrottleEvents metric for the DynamoDB table. Increase the maximum write capacity units (WCUs) for the table's scaling policy."
   },
   {
    "l": "E",
    "t": "Check the Throttles metric for the Lambda function. Increase the Lambda function timeout."
   }
  ],
  "ans": [
   "A",
   "D"
  ],
  "multi": 2,
  "expl": [
   "A: A high ApproximateAgeOfOldestMessage means Lambda cannot keep up. Reserved concurrency caps the number of concurrent executions, so this limit needs to be raised.",
   "D: WriteThrottleEvents shows that DynamoDB is throttling writes. Increase the maximum WCU of the scaling policy so the table can handle the write load."
  ],
  "wrong": [
   {
    "l": "B",
    "t": "A redrive policy only moves failed messages to a dead-letter queue; it does not speed up processing."
   },
   {
    "l": "C",
    "t": "NumberOfMessagesSent only counts messages sent in; increasing the visibility timeout does not resolve the bottleneck."
   },
   {
    "l": "E",
    "t": "Increasing the Lambda timeout does not reduce latency; the problem is a lack of concurrency."
   }
  ],
  "remember": "Backlogged queue: check ApproximateAgeOfOldestMessage. Slow DynamoDB: check WriteThrottleEvents.",
  "note": ""
 },
 {
  "n": 35,
  "title": "Collect Amazon Connect events from multiple accounts into the DevOps account",
  "summary": "Events from multiple accounts must be collected onto one event bus in a central DevOps account.",
  "stem": "A company has several AWS accounts. An Amazon Connect instance runs in each account. The company uses an Amazon EventBridge default event bus in each account for event handling.\n\nA DevOps team needs to receive all the Amazon Connect events in a single DevOps account.\n\nWhich solution meets these requirements?",
  "opts": [
   {
    "l": "A",
    "t": "Update the resource-based policy of the default event bus in each account to allow the DevOps account to replay events. Configure an EventBridge rule in the DevOps account that matches Amazon Connect events and has a target of the default event bus in the other accounts."
   },
   {
    "l": "B",
    "t": "Update the resource-based policy of the default event bus in each account to allow the DevOps account to receive events. Configure an EventBridge rule in the DevOps account that matches Amazon Connect events and has a target of the default event bus in the other accounts."
   },
   {
    "l": "C",
    "t": "Update the resource-based policy of the default event bus in the DevOps account. Update the policy to allow events to be received from the accounts. Configure an EventBridge rule in each account that matches Amazon Connect events and has a target of the DevOps account's default event bus."
   },
   {
    "l": "D",
    "t": "Update the resource-based policy of the default event bus in the DevOps account. Update the policy to allow events to be replayed by the accounts. Configure an EventBridge rule in each account that matches Amazon Connect events and has a target of the DevOps account's default event bus."
   }
  ],
  "ans": [
   "C"
  ],
  "multi": 1,
  "expl": [
   "Receiving account (DevOps): update the default event bus's resource-based policy to allow other accounts to put events onto the bus. Each source account: create an EventBridge rule that matches Amazon Connect events and set the target to the DevOps account's default event bus."
  ],
  "wrong": [
   {
    "l": "A and B",
    "t": "A rule in the DevOps account only matches events on its own bus; the forwarding direction is reversed: source accounts must push to DevOps."
   },
   {
    "l": "D",
    "t": "A policy allowing \"replay\" is wrong: replay re-sends events from an archive; it is not a permission to receive events from other accounts."
   }
  ],
  "remember": "Cross-account EventBridge: the source has a rule whose target is the destination bus; the destination bus has a resource policy allowing PutEvents.",
  "note": ""
 },
 {
  "n": 36,
  "title": "Route 53 weighted records still occasionally return the old S3 static website",
  "summary": "After moving to dynamic content (ALB), customers still occasionally see the old static website. The weighted record pointing to S3 (TTL 1 day) is still there.",
  "stem": "A company is hosting a static website from an Amazon S3 bucket. The website is available to customers at example.com. The company uses an Amazon Route 53 weighted routing policy with a TTL of 1 day. The company has decided to replace the existing static website with a dynamic web application. The dynamic web application uses an Application Load Balancer (ALB) in front of a fleet of Amazon EC2 instances.\n\nOn the day of production launch to customers, the company creates an additional Route 53 weighted DNS record entry that points to the ALB with a weight of 255 and a TTL of 1 hour. Two days later, a DevOps engineer notices that the previous static website is displayed sometimes when customers navigate to example.com.\n\nHow can the DevOps engineer ensure that the company serves only dynamic content for example.com?",
  "opts": [
   {
    "l": "A",
    "t": "Delete all objects, including previous versions, from the S3 bucket that contains the static website content."
   },
   {
    "l": "B",
    "t": "Update the weighted DNS record entry that points to the S3 bucket. Apply a weight of 0. Specify the domain reset option to propagate changes immediately."
   },
   {
    "l": "C",
    "t": "Configure webpage redirect requests on the S3 bucket with a hostname that redirects to the ALB."
   },
   {
    "l": "D",
    "t": "Remove the weighted DNS record entry that points to the S3 bucket from the example.com hosted zone. Wait for DNS propagation to become complete."
   }
  ],
  "ans": [
   "D"
  ],
  "multi": 1,
  "expl": [
   "The weighted record pointing to S3 still exists in the hosted zone, so Route 53 keeps returning it in proportion to its weight. Delete the weighted record pointing to S3 so only the ALB record remains, then wait for DNS propagation because resolvers may cache according to the TTL."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "Deleting the S3 content does not stop DNS from returning the S3 endpoint; customers would get errors."
   },
   {
    "l": "B",
    "t": "Setting the weight to 0 can stop traffic, but Route 53 has no \"domain reset\" option to force resolvers to flush their cache; it is less reliable than deleting the record."
   },
   {
    "l": "C",
    "t": "A redirect on S3 still makes users pass through the static website first."
   }
  ],
  "remember": "To stop serving an endpoint: delete the record; remember the TTL affects how long it takes to take effect.",
  "note": ""
 },
 {
  "n": 37,
  "title": "Create a CloudWatch metric from log content by response code and application name",
  "summary": "A CloudWatch metric must be created from log content, with response code and application name as dimensions.",
  "stem": "A company has an application that uploads access logs to an Amazon CloudWatch Logs log group. The fields in the log lines include the response code and the application name.\n\nThe company wants to create a CloudWatch metric to track the number of requests by response code in a specific range and with a specific application name.\n\nWhich solution will meet these requirements?",
  "opts": [
   {
    "l": "A",
    "t": "Create a CloudWatch Logs log event filter on the CloudWatch Logs log stream to match the response code range. Configure the log event filter to increment a metric. Set the response code and application name as dimensions."
   },
   {
    "l": "B",
    "t": "Create a CloudWatch Logs metric filter on the CloudWatch Logs log group to match the response code range. Configure the metric filter to increment a metric. Set the response code and application name as dimensions."
   },
   {
    "l": "C",
    "t": "Create a CloudWatch Contributor Insights rule on the CloudWatch Logs log stream with a filter to match the response code range. Configure the Contributor Insights rule to increment a CloudWatch metric with the response code and application name as dimensions."
   },
   {
    "l": "D",
    "t": "Create a CloudWatch Logs Insights query on the CloudWatch Logs log group to match the response code range. Configure the Logs Insights query to increment a CloudWatch metric with the response code and application name as dimensions."
   }
  ],
  "ans": [
   "B"
  ],
  "multi": 1,
  "expl": [
   "A metric filter on the log group matches a pattern in the log and increments a metric each time a line matches. For JSON logs or logs with delimited fields, set the response code and application name as dimensions."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "There is no \"log event filter\" attached to a log stream for creating metrics; metric filters are created at the log group level."
   },
   {
    "l": "C",
    "t": "Contributor Insights identifies top contributors; it does not create metrics with dimensions."
   },
   {
    "l": "D",
    "t": "A Logs Insights query is for on-demand querying and does not increment a metric automatically."
   }
  ],
  "remember": "Log -> metric = metric filter (log group level).",
  "note": ""
 },
 {
  "n": 38,
  "title": "Lambda IAM policy: apply least privilege (stop non-production instances)",
  "summary": "The current policy allows Action ec2:* on Resource *. The Lambda function only needs to stop non-production EC2 instances. The policy must be narrowed to least privilege.",
  "stem": "A company is reviewing its IAM policies. One policy written by the DevOps engineer has been flagged as too permissive. The policy is used by an AWS Lambda function that issues a stop command to Amazon EC2 instances tagged with `Environment: NonProduction` over the weekend. The current policy is:\n\n```json\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": \"ec2:*\",\n      \"Resource\": \"*\"\n    }\n  ]\n}\n```\n\nWhat changes should the engineer make to achieve a policy of least permission? (Select THREE.)",
  "opts": [
   {
    "l": "A",
    "t": "Add the following conditional expression:\n\n```json\n\"Condition\": {\n  \"StringEquals\": {\n    \"aws:principaltype\": \"lambda.amazonaws.com\"\n  }\n}\n```"
   },
   {
    "l": "B",
    "t": "Change `\"Resource\": \"*\"` to `\"Resource\": \"arn:aws:ec2:*:*:instance/*\"`"
   },
   {
    "l": "C",
    "t": "Add the following conditional expression:\n\n```json\n\"Condition\": {\n  \"StringNotEquals\": {\n    \"ec2:ResourceTag/Environment\": \"Production\"\n  }\n}\n```"
   },
   {
    "l": "D",
    "t": "Add the following conditional expression:\n\n```json\n\"Condition\": {\n  \"StringEquals\": {\n    \"ec2:ResourceTag/Environment\": \"NonProduction\"\n  }\n}\n```"
   },
   {
    "l": "E",
    "t": "Change `\"Action\": \"ec2:*\"` to `\"Action\": \"ec2:StopInstances\"`"
   },
   {
    "l": "F",
    "t": "Add the following conditional expression:\n\n```json\n\"Condition\": {\n  \"DateGreaterThan\": {\n    \"aws:CurrentTime\": \"${aws:DateTime:Friday}\"\n  },\n  \"DateLessThan\": {\n    \"aws:CurrentTime\": \"${aws:DateTime:Monday}\"\n  }\n}\n```"
   }
  ],
  "ans": [
   "B",
   "D",
   "E"
  ],
  "multi": 3,
  "expl": [
   "E: Change the Action to ec2:StopInstances to grant only the permission needed.",
   "B: Change the Resource to arn:aws:ec2:*:*:instance/*, limiting it to instance-type resources.",
   "D: Add a Condition StringEquals ec2:ResourceTag/Environment = NonProduction so only correctly tagged instances can be stopped."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "aws:principaltype only indicates the type of principal calling the API; it does not restrict permissions by resource."
   },
   {
    "l": "C",
    "t": "StringNotEquals Production is an exclusion style that would still allow stopping instances with any tag other than Production, which is broader than StringEquals NonProduction."
   },
   {
    "l": "F",
    "t": "A time condition with the variable ${aws:DateTime:Friday} is not valid IAM syntax and does not restrict by resource."
   }
  ],
  "remember": "Least privilege = correct Action + correct Resource + Condition (tag). Prefer allow-lists over deny-lists.",
  "note": "Đề gốc nằm trên 2 ảnh chụp màn hình; các lựa chọn đã được ghép lại theo thứ tự A-F."
 },
 {
  "n": 39,
  "title": "Self-heal when CloudTrail is turned off, with the least downtime",
  "summary": "A solution is needed to self-heal when CloudTrail is turned off so that the period without logging is as short as possible.",
  "stem": "The security team depends on AWS CloudTrail to detect sensitive security issues in the company's AWS account. The DevOps engineer needs a solution to auto-remediate CloudTrail being turned off in an AWS account.\n\nWhat solution ensures the LEAST amount of downtime for the CloudTrail log deliveries?",
  "opts": [
   {
    "l": "A",
    "t": "Create an Amazon EventBridge rule for the CloudTrail StopLogging event. Create an AWS Lambda function that uses the AWS SDK to call StartLogging on the ARN of the resource in which StopLogging was called. Add the Lambda function ARN as a target to the EventBridge rule."
   },
   {
    "l": "B",
    "t": "Deploy the AWS-managed CloudTrail-enabled AWS Config rule, set with a periodic interval of 1 hour. Create an Amazon EventBridge rule for AWS Config rules compliance change. Create an AWS Lambda function that uses the AWS SDK to call StartLogging on the ARN of the resource in which StopLogging was called. Add the Lambda function ARN as a target to the EventBridge rule."
   },
   {
    "l": "C",
    "t": "Create an Amazon EventBridge rule for a scheduled event every 5 minutes. Create an AWS Lambda function that uses the AWS SDK to call StartLogging on a CloudTrail trail in the AWS account. Add the Lambda function ARN as a target to the EventBridge rule."
   },
   {
    "l": "D",
    "t": "Launch a t2.nano instance with a script running every 5 minutes that uses the AWS SDK to query CloudTrail in the current account. If the CloudTrail trail is disabled, have the script re-enable the trail."
   }
  ],
  "ans": [
   "A"
  ],
  "multi": 1,
  "expl": [
   "An event-driven solution is nearly instantaneous: an EventBridge rule for the CloudTrail StopLogging event, with a Lambda function calling StartLogging on the trail ARN taken from the event. The gap is only seconds."
  ],
  "wrong": [
   {
    "l": "B",
    "t": "A Config rule evaluating periodically every hour means the trail could be off for up to an hour before detection."
   },
   {
    "l": "C",
    "t": "A 5-minute schedule means downtime could be up to 5 minutes and the function does not know which trail was stopped."
   },
   {
    "l": "D",
    "t": "An instance running a script every 5 minutes also has up to 5 minutes of delay, plus extra cost and operational effort."
   }
  ],
  "remember": "Fastest reaction = event-driven (EventBridge) rather than polling.",
  "note": ""
 },
 {
  "n": 40,
  "title": "Two CloudFormation stacks managed by separate teams: share database resources",
  "summary": "The database team and the software team each have their own templates, lifecycles, change-set reviews and CI/CD; the software team needs to use database resources.",
  "stem": "A company is developing a web application's infrastructure using AWS CloudFormation. The database engineering team maintains the database resources in a CloudFormation template, and the software development team maintains the web application resources in a separate CloudFormation template. As the scope of the application grows, the software development team needs to use resources maintained by the database engineering team. However, both teams have their own review and lifecycle management processes that they want to keep. Both teams also require resource-level change-set reviews. The software development team would like to deploy changes to this template using their CI/CD pipeline.\n\nWhich solution will meet these requirements?",
  "opts": [
   {
    "l": "A",
    "t": "Create a stack export from the database CloudFormation template and import those references into the web application CloudFormation template."
   },
   {
    "l": "B",
    "t": "Create a CloudFormation nested stack to make cross-stack resource references and parameters available in both stacks."
   },
   {
    "l": "C",
    "t": "Create a CloudFormation stack set to make cross-stack resource references and parameters available in both stacks."
   },
   {
    "l": "D",
    "t": "Create input parameters in the web application CloudFormation template and pass resource names and IDs from the database stack."
   }
  ],
  "ans": [
   "A"
  ],
  "multi": 1,
  "expl": [
   "Export from the database template's stack (Outputs with Export) and import with Fn::ImportValue in the web application template. The two stacks remain independent, each team keeps its own pipeline and change-set review, but they can reference each other's resources."
  ],
  "wrong": [
   {
    "l": "B",
    "t": "A nested stack merges child stacks into the parent, so the two teams no longer manage independent lifecycles."
   },
   {
    "l": "C",
    "t": "StackSets deploys the same template to multiple accounts/Regions; it does not share resource references."
   },
   {
    "l": "D",
    "t": "Passing names and IDs through parameters is manual, prone to drift, and creates no direct link between the stacks."
   }
  ],
  "remember": "Independent stacks referencing each other = Export/ImportValue. Same lifecycle = nested stack.",
  "note": ""
 },
 {
  "n": 41,
  "title": "CodeDeploy one instance at a time, monitor CPU and roll back above 85%",
  "summary": "A CPU-intensive application must be deployed one instance at a time and automatically rolled back if the CPU of the instance being deployed exceeds 85%.",
  "stem": "A company has a mission-critical application on AWS that uses automatic scaling. The company wants the deployment lifecycle to meet the following parameters:\n\n- The application must be deployed one instance at a time to ensure the remaining fleet continues to serve traffic.\n- The application is CPU intensive and must be closely monitored.\n- The deployment must automatically roll back if the CPU utilization of the deployment instance exceeds 85%.\n\nWhich solution will meet these requirements?",
  "opts": [
   {
    "l": "A",
    "t": "Use AWS CloudFormation to create an AWS Step Functions state machine and Auto Scaling lifecycle hooks to move one instance at a time into a wait state. Use AWS Systems Manager automation to deploy the update to each instance and move it back into the Auto Scaling group using the heartbeat timeout."
   },
   {
    "l": "B",
    "t": "Use AWS CodeDeploy with Amazon EC2 Auto Scaling. Configure an alarm tied to the CPU utilization metric. Use the CodeDeployDefault.OneAtATime configuration as a deployment strategy. Configure automatic rollbacks within the deployment group to roll back the deployment if the alarm thresholds are breached."
   },
   {
    "l": "C",
    "t": "Use AWS Elastic Beanstalk for load balancing and AWS Auto Scaling. Configure an alarm tied to the CPU utilization metric. Configure rolling deployments with a fixed batch size of one instance. Enable enhanced health to monitor the status of the deployment and roll back based on the alarm previously created."
   },
   {
    "l": "D",
    "t": "Use AWS Systems Manager to perform a blue/green deployment with Amazon EC2 Auto Scaling. Configure an alarm tied to the CPU utilization metric. Deploy updates one at a time. Configure automatic rollbacks within the Auto Scaling group to roll back the deployment if the alarm thresholds are breached."
   }
  ],
  "ans": [
   "B"
  ],
  "multi": 1,
  "expl": [
   "CodeDeploy with EC2 Auto Scaling: CodeDeployDefault.OneAtATime deploys one instance at a time; a CloudWatch alarm on CPU utilization (85% threshold); enable automatic rollback in the deployment group when the alarm triggers."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "Building your own Step Functions, lifecycle hooks and Automation is very complex and has no built-in alarm-based rollback."
   },
   {
    "l": "C",
    "t": "Elastic Beanstalk rolling does not roll back automatically on the CPU alarm of the instance being deployed; enhanced health is only for monitoring."
   },
   {
    "l": "D",
    "t": "Systems Manager has no blue/green with alarm-based rollback; an Auto Scaling group does not configure automatic rollback for deployments."
   }
  ],
  "remember": "Deployment config (OneAtATime/HalfAtATime/AllAtOnce) + alarm + auto rollback = CodeDeploy.",
  "note": ""
 },
 {
  "n": 42,
  "title": "ECS: tasks keep being stopped and restarted because ALB health checks fail after an image change",
  "summary": "The service was stable before; after deploying a task definition with a new image, tasks are repeatedly stopped/restarted because ALB health checks fail.",
  "stem": "A company runs a website by using an Amazon Elastic Container Service (Amazon ECS) service that is connected to an Application Load Balancer (ALB). The service was in a steady state with tasks responding to requests successfully.\n\nA DevOps engineer updated the task definition with a new container image and deployed the new task definition to the service. The DevOps engineer noticed that the service is frequently stopping and starting new tasks because the ALB health checks are failing.\n\nWhat should the DevOps engineer do to troubleshoot the failed deployment?",
  "opts": [
   {
    "l": "A",
    "t": "Ensure that a security group associated with the service allows traffic from the ALB."
   },
   {
    "l": "B",
    "t": "Increase the ALB health check grace period for the service."
   },
   {
    "l": "C",
    "t": "Increase the service minimum healthy percent setting."
   },
   {
    "l": "D",
    "t": "Decrease the ALB health check interval."
   }
  ],
  "ans": [
   "B"
  ],
  "multi": 1,
  "expl": [
   "The service responded fine before the update, so the new container most likely needs more time to start. If ECS evaluates the ALB health check too early, the task is considered unhealthy and stopped, and the cycle repeats. Increase the health check grace period so ECS ignores ALB health check results while the task starts up."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "The service was already responding through the ALB, so the security group already allowed it; changing the image does not change that."
   },
   {
    "l": "C",
    "t": "Minimum healthy percent only controls the minimum number of tasks during deployment."
   },
   {
    "l": "D",
    "t": "Reducing the interval makes the ALB check more often and mark targets unhealthy sooner, which makes things worse."
   }
  ],
  "remember": "Slow-starting app + ECS + ALB = increase healthCheckGracePeriodSeconds.",
  "note": ""
 },
 {
  "n": 43,
  "title": "Alert when an SQS queue exceeds the expected size (most operationally efficient)",
  "summary": "The team has already subscribed to an SNS topic; an alert is needed when the number of messages in the queue exceeds the expected level.",
  "stem": "A DevOps team manages infrastructure for an application. The application uses long-running processes to process items from an Amazon Simple Queue Service (Amazon SQS) queue. The application is deployed to an Auto Scaling group.\n\nThe application recently experienced an issue where items were taking significantly longer to process. The queue exceeded the expected size, which prevented various business processes from functioning properly. The application records all logs to a third-party tool.\n\nThe team is currently subscribed to an Amazon Simple Notification Service (Amazon SNS) topic that the team uses for alerts. The team needs to be alerted if the queue exceeds the expected size.\n\nWhich solution will meet these requirements with the MOST operational efficiency?",
  "opts": [
   {
    "l": "A",
    "t": "Create an Amazon CloudWatch metric alarm with a period of 1 hour and a static threshold to alarm if the average of the ApproximateNumberOfMessagesDelayed metric is greater than the expected value. Configure the alarm to notify the SNS topic."
   },
   {
    "l": "B",
    "t": "Create an Amazon CloudWatch metric alarm with a period of 1 hour and a static threshold to alarm if the sum of the ApproximateNumberOfMessagesVisible metric is greater than the expected value. Configure the alarm to notify the SNS topic."
   },
   {
    "l": "C",
    "t": "Create an AWS Lambda function that retrieves the ApproximateNumberOfMessages SQS queue attribute value and publishes the value as a new CloudWatch custom metric. Create an Amazon EventBridge rule that is scheduled to run every 5 minutes and that invokes the Lambda function. Configure a CloudWatch metrics alarm with a period of 1 hour and a static threshold to alarm if the sum of the new custom metric is greater than the expected value."
   },
   {
    "l": "D",
    "t": "Create an AWS Lambda function that checks the ApproximateNumberOfMessagesDelayed SQS queue attribute and compares the value to a defined expected size in the function. Create an Amazon EventBridge rule that is scheduled to run every 5 minutes and that invokes the Lambda function. When the ApproximateNumberOfMessagesDelayed SQS queue attribute exceeds the expected size, send a notification to the SNS topic."
   }
  ],
  "ans": [
   "B"
  ],
  "multi": 1,
  "expl": [
   "SQS automatically publishes the ApproximateNumberOfMessagesVisible metric (messages waiting to be processed) to CloudWatch. Simply create a static-threshold alarm on this metric (using Sum) and configure an action to send to the existing SNS topic. No code or infrastructure is needed."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "ApproximateNumberOfMessagesDelayed only counts delayed messages (delay queue/timer) and does not reflect queue size."
   },
   {
    "l": "C and D",
    "t": "Using Lambda + EventBridge to obtain the value is unnecessary because CloudWatch already has the corresponding metric; D also uses the wrong Delayed attribute."
   }
  ],
  "remember": "Queue length = ApproximateNumberOfMessagesVisible.",
  "note": ""
 },
 {
  "n": 44,
  "title": "Force requests to an HTTP API to go through CloudFront",
  "summary": "An audit found that internet requests can call the API Gateway HTTP API directly without going through CloudFront. All connections must be forced through CloudFront.",
  "stem": "A company deployed an Amazon CloudFront distribution that accepts requests and routes to an Amazon API Gateway HTTP API. During a recent security audit, the company discovered that requests from the internet could reach the HTTP API without using the CloudFront distribution.\n\nA DevOps engineer must ensure that connections to the HTTP API use the CloudFront distribution.\n\nWhich solution will meet these requirements?",
  "opts": [
   {
    "l": "A",
    "t": "Enable VPC Flow Logs to identify requests that reach the HTTP API."
   },
   {
    "l": "B",
    "t": "Deploy AWS WAF in front of the CloudFront distribution."
   },
   {
    "l": "C",
    "t": "Implement an identity-based policy on the CloudFront distribution that requires authentication to make requests to the HTTP API."
   },
   {
    "l": "D",
    "t": "Implement a custom header in the CloudFront distribution. Implement an AWS Lambda authorizer associated with the HTTP API that verifies the custom header."
   }
  ],
  "ans": [
   "D"
  ],
  "multi": 1,
  "expl": [
   "Use a custom origin header: CloudFront adds a secret header to every request sent to the origin; a Lambda authorizer attached to the HTTP API checks this header and only allows requests with the correct value. Requests that go straight to the API have no header and are rejected."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "VPC Flow Logs only observe traffic and do not block it; the HTTP API is not in your VPC."
   },
   {
    "l": "B",
    "t": "WAF in front of CloudFront only filters requests entering CloudFront; it does not prevent calling the API endpoint directly."
   },
   {
    "l": "C",
    "t": "CloudFront does not support an identity-based policy of this kind; identity-based policies are attached to IAM users/roles."
   }
  ],
  "remember": "Lock an origin to accept only CloudFront: secret custom header (or OAC for S3).",
  "note": ""
 },
 {
  "n": 45,
  "title": "ECS rolling update: automatically roll back when tasks fail to start",
  "summary": "An ECS service uses rolling updates and is deployed with CloudFormation. When a deployment fails, the service gets stuck in a FAILED state. It must automatically roll back to the last completed deployment, with the least operational effort.",
  "stem": "A DevOps engineer is updating an existing service in an Amazon Elastic Container Service (Amazon ECS) cluster. The service uses the rolling update deployment type. All updates to the cluster are deployed by using AWS CloudFormation.\n\nCurrently no automated remediation occurs when a deployment fails. The service remains in a FAILED state until the DevOps team manually resolves the discovered issues.\n\nThe DevOps engineer needs to configure an automatic solution to remediate when a deployment fails because the service task fails to start. The service must be automatically rolled back to its most recent completed deployment.\n\nWhich solution will meet these requirements with the LEAST operational overhead?",
  "opts": [
   {
    "l": "A",
    "t": "Configure Amazon CloudWatch alarms that check the service's runtime metrics. Update the service deployment configuration to reference the new alarms."
   },
   {
    "l": "B",
    "t": "Set an Amazon EventBridge rule that uses the SERVICE_DEPLOYMENT_FAILED event name. Add an AWS Lambda function target that rolls the service back to the most recent deployment that is in a COMPLETED state."
   },
   {
    "l": "C",
    "t": "Update the service to use the ECS deployment circuit breaker failure detection support. Configure the service to roll back on failures."
   },
   {
    "l": "D",
    "t": "Use an AWS CodeDeploy deployment group for all ECS service updates. Configure automatic rollbacks on the deployment group to roll back to the most recent successful deployment when a deployment fails."
   }
  ],
  "ans": [
   "C"
  ],
  "multi": 1,
  "expl": [
   "The ECS deployment circuit breaker is built in for services using rolling updates. When tasks fail to start, the circuit breaker detects the failed deployment and, if rollback is enabled, automatically returns the service to the last completed deployment. CloudFormation supports this property; it is only a configuration change."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "A CloudWatch alarm on runtime metrics cannot detect tasks that fail to start and requires extra configuration."
   },
   {
    "l": "B",
    "t": "An EventBridge + Lambda custom rollback must be built and maintained, while ECS already has this feature."
   },
   {
    "l": "D",
    "t": "Switching to CodeDeploy changes the deployment type (blue/green) and takes far more effort."
   }
  ],
  "remember": "ECS rolling + automatic rollback = deployment circuit breaker (rollback: true).",
  "note": ""
 },
 {
  "n": 46,
  "title": "Portable IaC for EKS + FSx for Lustre + S3, shared across member accounts",
  "summary": "An IaC solution must be designed that is highly portable, easy to share among member accounts, and has the lowest administrative overhead.",
  "stem": "A DevOps engineer at a company is migrating a statistical analysis application to AWS. The application allows data scientists to model demographic data by using RStudio. The DevOps engineer will host modeling environments for the application in Amazon Elastic Kubernetes Service (Amazon EKS). The DevOps engineer will use Amazon FSx for Lustre and Amazon S3 to provide backend storage.\n\nThe DevOps engineer must design and build an infrastructure as code (IaC) solution to manage the underlying resource configurations. The company uses an organization in AWS Organizations to manage multiple AWS accounts. The DevOps engineer must design a highly portable solution that can facilitate sharing across AWS member accounts.\n\nWhich solution will meet these requirements with the LEAST administrative overhead?",
  "opts": [
   {
    "l": "A",
    "t": "Use the AWS Cloud Development Kit (AWS CDK) to deploy and manage the infrastructure. Store the CDK source code in the project's version control system. Use AWS CodePipeline to automate the deployment and stack updates in production."
   },
   {
    "l": "B",
    "t": "Use AWS CloudFormation to manage the infrastructure. Use CloudFormation modules to manage the required services. Publish the services to the CloudFormation registry. Use AWS CodePipeline to automate the deployment and stack updates in production."
   },
   {
    "l": "C",
    "t": "Use AWS Serverless Application Model (AWS SAM) to manage the infrastructure. Create an AWS Service Catalog portfolio for the project. Build an AWS SAM template that deploys each required service as a product within the catalog. Share the portfolio and grant access to the portfolio for member accounts."
   },
   {
    "l": "D",
    "t": "Use AWS CloudFormation to manage the infrastructure. Use CloudFormation nested stacks to manage the required services. Store the nested stacks in the project's version control system. Use AWS CodePipeline to automate the deployment and stack updates in production."
   }
  ],
  "ans": [
   "C"
  ],
  "multi": 1,
  "expl": [
   "AWS Service Catalog packages each service (EKS, FSx for Lustre, S3) as a product in a portfolio, built from AWS SAM templates (an extension of CloudFormation). Share the portfolio through Organizations with member accounts, which can deploy it themselves using the standard configuration without copying templates."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "CDK + CodePipeline automates deployment but has no built-in way to share with many member accounts."
   },
   {
    "l": "B",
    "t": "CloudFormation modules in the registry are still template-level sharing and you must manage the distribution yourself."
   },
   {
    "l": "D",
    "t": "Nested stacks in version control do not make it easy for other accounts to provision and provide no access control."
   }
  ],
  "remember": "Sharing standard infrastructure across accounts = Service Catalog portfolio shared through Organizations.",
  "note": ""
 },
 {
  "n": 47,
  "title": "One pipeline deploying in parallel to multiple ALB–Auto Scaling group pairs",
  "summary": "A SaaS has multiple ALBs, each with its own Auto Scaling group/EC2 fleet. Every commit must be deployed to all of them at the same time, with no build stage and minimal configuration.",
  "stem": "A DevOps engineer is architecting a continuous development strategy for a company's software as a service (SaaS) web application running on AWS. For application and security reasons, users subscribing to this application are distributed across multiple Application Load Balancers (ALBs), each of which has a dedicated Auto Scaling group and fleet of Amazon EC2 instances. The application does not require a build stage, and when it is committed to an AWS CodeConnections compatible Git repository, the application must trigger a simultaneous deployment to all ALBs, Auto Scaling groups, and EC2 fleets.\n\nWhich architecture will meet these requirements with the LEAST amount of configuration?",
  "opts": [
   {
    "l": "A",
    "t": "Create a single AWS CodePipeline pipeline that deploys the application in parallel using unique AWS CodeDeploy applications and deployment groups created for each ALB-Auto Scaling group pair."
   },
   {
    "l": "B",
    "t": "Create a single AWS CodePipeline pipeline that deploys the application using a single AWS CodeDeploy application and single deployment group."
   },
   {
    "l": "C",
    "t": "Create a single AWS CodePipeline pipeline that deploys the application in parallel using a single AWS CodeDeploy application and unique deployment group for each ALB-Auto Scaling group pair."
   },
   {
    "l": "D",
    "t": "Create an AWS CodePipeline pipeline for each ALB-Auto Scaling group pair that deploys the application using an AWS CodeDeploy application and deployment group created for the same ALB-Auto Scaling group pair."
   }
  ],
  "ans": [
   "C"
  ],
  "multi": 1,
  "expl": [
   "A single CodePipeline triggered on commit (through CodeConnections). Multiple CodeDeploy actions run in parallel within the same stage. One CodeDeploy application (same app, same revision) with a separate deployment group for each ALB–ASG pair, which keeps configuration minimal."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "Creating a separate CodeDeploy application for each pair is unnecessary."
   },
   {
    "l": "B",
    "t": "A deployment group is tied to one specific ASG/load balancer group and does not deploy simultaneously to multiple separate fleets."
   },
   {
    "l": "D",
    "t": "One pipeline per pair duplicates configuration many times and has no shared trigger."
   }
  ],
  "remember": "1 pipeline + 1 application + N deployment groups + parallel actions.",
  "note": ""
 },
 {
  "n": 48,
  "title": "EC2 accessing a CodeArtifact repository to install Python packages",
  "summary": "A CodeDeploy BeforeInstall hook installs Python packages stored in CodeArtifact. The EC2 instances must be granted access to the repository.",
  "stem": "A company uses an AWS CodeArtifact repository to store Python packages that the company developed internally. A DevOps engineer needs to use AWS CodeDeploy to deploy an application to an Amazon EC2 instance. The application uses a Python package that is stored in the CodeArtifact repository. A BeforeInstall lifecycle event hook will install the package.\n\nThe DevOps engineer needs to grant the EC2 instance access to the CodeArtifact repository.\n\nWhich solution will meet this requirement?",
  "opts": [
   {
    "l": "A",
    "t": "Create a service-linked role for CodeArtifact. Associate the role with the EC2 instance. Use the aws codeartifact get-authorization-token CLI command on the instance."
   },
   {
    "l": "B",
    "t": "Configure a resource-based policy for the CodeArtifact repository that allows the ReadFromRepository action for the EC2 instance principal."
   },
   {
    "l": "C",
    "t": "Configure ACLs on the CodeArtifact repository to allow the EC2 instance to access the Python package."
   },
   {
    "l": "D",
    "t": "Create an instance profile that contains an IAM role that has access to CodeArtifact. Associate the instance profile with the EC2 instance. Use the aws codeartifact login CLI command on the instance."
   }
  ],
  "ans": [
   "D"
  ],
  "multi": 1,
  "expl": [
   "Create an instance profile containing an IAM role with permission to access CodeArtifact (codeartifact:GetAuthorizationToken, GetRepositoryEndpoint, ReadFromRepository and sts:GetServiceBearerToken). Use the aws codeartifact login command to get a token and configure pip to point at the repository."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "CodeArtifact does not use a service-linked role to grant EC2 access to a repository."
   },
   {
    "l": "B",
    "t": "EC2 is not an independent principal; a role through an instance profile is needed, and a repository policy also does not configure pip automatically."
   },
   {
    "l": "C",
    "t": "CodeArtifact does not use ACLs."
   }
  ],
  "remember": "EC2 using CodeArtifact: instance profile + aws codeartifact login.",
  "note": ""
 },
 {
  "n": 49,
  "title": "ECS workers processing SQS within 10 minutes while reducing idle resources",
  "summary": "An ECS task that processes SQS on a 10-minute schedule takes many hours when there are many messages. New SLO: process within 10 minutes of sending, while reducing idle resources.",
  "stem": "A company runs an application as an Amazon Elastic Container Service (Amazon ECS) task to process messages from an Amazon Simple Queue Service (Amazon SQS) queue. The ECS task runs on a schedule to process the SQS queue every 10 minutes.\n\nA high volume of messages was delivered to the SQS queue. The application took several hours to process all the messages. The company's new service level objective (SLO) requires that the application must process messages within 10 minutes of delivery.\n\nA DevOps engineer needs to configure the application to meet the SLO while minimizing idle running resources.\n\nWhich solution meets these requirements with the MOST operational efficiency?",
  "opts": [
   {
    "l": "A",
    "t": "Configure a step scaling policy for the ECS task. Configure the step scaling policy to use the ECSServiceAverageMemoryUtilization metric. Set the maximum number of tasks to equal the number of messages the application receives at peak hours."
   },
   {
    "l": "B",
    "t": "Configure a target tracking scaling policy for the ECS task. Calculate the number of messages for each task by using the SQS ApproximateNumberOfMessagesVisible metric and the ECS RunningTaskCount metric. Scale the number of tasks based on the calculated attribute."
   },
   {
    "l": "C",
    "t": "Create a scheduled scaling policy to increase the number of ECS tasks available during peak volume periods. Set the schedule as a cron for the application's peak hours. Set the maximum number of tasks to equal the number of messages the application receives at peak hours."
   },
   {
    "l": "D",
    "t": "Create a predictive scaling policy to increase the number of available ECS tasks during peak volume periods. Configure the predictive scaling policy to use the ECSServiceAverageCPUUtilization metric. Set the maximum number of tasks to equal the number of messages the application receives at peak hours."
   }
  ],
  "ans": [
   "B"
  ],
  "multi": 1,
  "expl": [
   "Target tracking on \"backlog per task\": compute messages per task as ApproximateNumberOfMessagesVisible divided by RunningTaskCount. Auto scaling adds tasks when the queue builds up and removes them as it drains, meeting the SLO without keeping many idle tasks."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "Scaling on memory does not reflect queue length; setting the maximum task count equal to the number of messages is wasteful."
   },
   {
    "l": "C",
    "t": "Scheduled scaling only suits load at fixed times and still keeps many idle tasks."
   },
   {
    "l": "D",
    "t": "Predictive scaling on CPU is not tied to the number of messages in the queue."
   }
  ],
  "remember": "Queue-driven workers: scale on backlog per instance/task.",
  "note": ""
 },
 {
  "n": 50,
  "title": "Allow IPv6 clients to reach a service behind an ALB (EC2 in private subnets)",
  "summary": "A CloudFormation template deploys a web service on EC2 in private subnets behind an ALB; the service must accept requests from IPv6 clients.",
  "stem": "A DevOps engineer is creating an AWS CloudFormation template to deploy a web service. The web service will run on Amazon EC2 instances in a private subnet behind an Application Load Balancer (ALB). The DevOps engineer must ensure that the service can accept requests from clients that have IPv6 addresses.\n\nWhat should the DevOps engineer do with the CloudFormation template so that IPv6 clients can access the web service?",
  "opts": [
   {
    "l": "A",
    "t": "Add an IPv6 CIDR block to the VPC and the private subnet for the EC2 instances. Create route table entries for the IPv6 network, use EC2 instance types that support IPv6, and assign IPv6 addresses to each EC2 instance."
   },
   {
    "l": "B",
    "t": "Assign each EC2 instance an IPv6 Elastic IP address. Create a target group, and add the EC2 instances as targets. Create a listener on port 443 of the ALB, and associate the target group with the ALB."
   },
   {
    "l": "C",
    "t": "Replace the ALB with a Network Load Balancer (NLB). Add an IPv6 CIDR block to the VPC and subnets for the NLB, and assign the NLB an IPv6 Elastic IP address."
   },
   {
    "l": "D",
    "t": "Add an IPv6 CIDR block to the VPC and subnets for the ALB. Create a listener on port 443, and specify the dualstack IP address type on the ALB. Create a target group, and add the EC2 instances as targets. Associate the target group with the ALB."
   }
  ],
  "ans": [
   "D"
  ],
  "multi": 1,
  "expl": [
   "Only the ALB needs to accept IPv6; the EC2 instances behind it can keep using IPv4. Add an IPv6 CIDR block to the VPC and the ALB's subnets, set the ALB's IP address type to dualstack, create a listener on port 443, and a target group containing the EC2 instances attached to the ALB."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "There is no need to assign IPv6 to each EC2 instance because the ALB bridges IPv6 clients and IPv4 targets."
   },
   {
    "l": "B",
    "t": "IPv6 has no Elastic IPs, and EC2 in private subnets does not need a public address."
   },
   {
    "l": "C",
    "t": "NLB does not support IPv6 Elastic IPs; replacing the ALB with an NLB is an unnecessary change."
   }
  ],
  "remember": "IPv6 for ALB = subnets with IPv6 + IP address type dualstack.",
  "note": ""
 },
 {
  "n": 51,
  "title": "Count daily RDP sessions to EC2 instances",
  "summary": "The company wants to collect a metric of the number of RDP sessions that employees start to EC2 instances each day.",
  "stem": "A company runs a fleet of Amazon EC2 instances in a VPC. The company's employees remotely access the EC2 instances by using the Remote Desktop Protocol (RDP).\n\nThe company wants to collect metrics about how many RDP sessions the employees initiate every day.\n\nWhich combination of steps will meet this requirement? (Select THREE.)",
  "opts": [
   {
    "l": "A",
    "t": "Create an Amazon EventBridge rule that reacts to EC2 Instance State-change Notification events."
   },
   {
    "l": "B",
    "t": "Create an Amazon CloudWatch Logs log group. Specify the log group as a target for the EventBridge rule."
   },
   {
    "l": "C",
    "t": "Create a flow log in VPC Flow Logs."
   },
   {
    "l": "D",
    "t": "Create an Amazon CloudWatch Logs log group. Specify the log group as a destination for the flow log."
   },
   {
    "l": "E",
    "t": "Create a log group metric filter."
   },
   {
    "l": "F",
    "t": "Create a log group subscription filter. Use EventBridge as the destination."
   }
  ],
  "ans": [
   "C",
   "D",
   "E"
  ],
  "multi": 3,
  "expl": [
   "C: VPC Flow Logs record network traffic, including connections to the RDP port (3389).",
   "D: Send the flow logs to a CloudWatch Logs log group so they can be filtered and analyzed.",
   "E: A metric filter on the log group matches records whose destination is port 3389 (accepted connections) and increments a metric on each match, producing the number of RDP sessions per day."
  ],
  "wrong": [
   {
    "l": "A and B",
    "t": "Instance State-change Notification only reports EC2 state changes (start, stop, ...); it has nothing to do with RDP sessions."
   },
   {
    "l": "F",
    "t": "A subscription filter forwards logs to Kinesis/Lambda/Firehose, and EventBridge is not a valid destination for a subscription filter."
   }
  ],
  "remember": "Counting network connections by port = Flow Logs -> CloudWatch Logs -> metric filter.",
  "note": ""
 },
 {
  "n": 52,
  "title": "Auto Scaling always uses the latest AMI built by EC2 Image Builder",
  "summary": "An Image Builder pipeline builds a hardened AMI on a schedule; the Auto Scaling group's launch template must always use the latest AMI when launching instances, in the most operationally efficient way.",
  "stem": "A company's security policies require the use of security hardened AMIs in production environments. A DevOps engineer has used EC2 Image Builder to create a pipeline that builds the AMIs on a recurring schedule.\n\nThe DevOps engineer needs to update the launch templates of the company's Auto Scaling groups. The Auto Scaling groups must use the newest AMIs during the launch of Amazon EC2 instances.\n\nWhich solution will meet these requirements with the MOST operational efficiency?",
  "opts": [
   {
    "l": "A",
    "t": "Configure an Amazon EventBridge rule to receive new AMI events from Image Builder. Target an AWS Systems Manager Run Command document that updates the launch templates of the Auto Scaling groups with the newest AMI ID."
   },
   {
    "l": "B",
    "t": "Configure an Amazon EventBridge rule to receive new AMI events from Image Builder. Target an AWS Lambda function that updates the launch templates of the Auto Scaling groups with the newest AMI ID."
   },
   {
    "l": "C",
    "t": "Configure the launch template to use a value from AWS Systems Manager Parameter Store for the AMI ID. Configure the Image Builder pipeline to update the Parameter Store value with the newest AMI ID."
   },
   {
    "l": "D",
    "t": "Configure the Image Builder distribution settings to update the launch templates with the newest AMI ID. Configure the Auto Scaling groups to use the newest version of the launch template."
   }
  ],
  "ans": [
   "C"
  ],
  "multi": 1,
  "expl": [
   "A launch template can reference the AMI ID through Systems Manager Parameter Store (in the form resolve:ssm:<parameter-name>), which is resolved when the instance is launched. Image Builder distribution settings natively support updating an SSM parameter with the new AMI. Every time the ASG launches an instance it uses the latest AMI, with no need to create a new launch template version or write code."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "Using Run Command to update the launch template is roundabout and not what Run Command is for."
   },
   {
    "l": "B",
    "t": "Writing your own Lambda to update the launch template means maintaining code."
   },
   {
    "l": "D",
    "t": "Updating the launch template via distribution settings creates a new version, and the ASG must be configured to use the right version; this is more complex than updating a single Parameter Store value."
   }
  ],
  "remember": "Latest AMI for an ASG = SSM parameter updated by Image Builder + launch template resolve:ssm.",
  "note": ""
 },
 {
  "n": 53,
  "title": "CodeDeploy fails at AllowTraffic and the logs do not state the cause",
  "summary": "A CodeDeploy deployment of a new version to EC2 behind an ALB fails at the AllowTraffic event and the deployment logs do not indicate the cause.",
  "stem": "An application runs on Amazon EC2 instances behind an Application Load Balancer (ALB). A DevOps engineer is using AWS CodeDeploy to release a new version. The deployment fails during the AllowTraffic lifecycle event, but a cause for the failure is not indicated in the deployment logs.\n\nWhat would cause this?",
  "opts": [
   {
    "l": "A",
    "t": "The appspec.yml file contains an invalid script that runs in the AllowTraffic lifecycle hook."
   },
   {
    "l": "B",
    "t": "The user who initiated the deployment does not have the necessary permissions to interact with the ALB."
   },
   {
    "l": "C",
    "t": "The health checks specified for the ALB target group are misconfigured."
   },
   {
    "l": "D",
    "t": "The CodeDeploy agent was not installed in the EC2 instances that are part of the ALB target group."
   }
  ],
  "ans": [
   "C"
  ],
  "multi": 1,
  "expl": [
   "AllowTraffic is managed by CodeDeploy itself: it registers the instance with the ALB's target group and then waits for the health check to report healthy. If the target group's health check is misconfigured (path, port, response code), the instance never becomes healthy and the deployment fails at this step. The problem is on the ALB side, so the deployment logs usually don't give a specific cause."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "AllowTraffic does not run custom scripts from appspec.yml."
   },
   {
    "l": "B",
    "t": "Permissions to interact with the ALB are on CodeDeploy's service role, not on the identity that started the deployment."
   },
   {
    "l": "D",
    "t": "A missing CodeDeploy agent makes the deployment fail at earlier events (such as Start); it would never reach AllowTraffic."
   }
  ],
  "remember": "Failure at AllowTraffic with no clear reason: check the target group's health check.",
  "note": ""
 },
 {
  "n": 54,
  "title": "Consistent deployment for Lambda and ECS: less downtime, configuration management",
  "summary": "A microservices application consists of Lambda and ECS and is deployed frequently. A consistent, automated solution is needed that reduces downtime and manages configuration data, with the least development effort.",
  "stem": "A company is developing a microservices-based application on AWS. The application consists of AWS Lambda functions and Amazon Elastic Container Service (Amazon ECS) services that need to be deployed frequently.\n\nA DevOps engineer needs to implement a consistent deployment solution across all components of the application. The solution must automate the deployments, minimize downtime during updates, and manage configuration data for the application.\n\nWhich solution will meet these requirements with the LEAST development effort?",
  "opts": [
   {
    "l": "A",
    "t": "Use AWS CloudFormation to define and provision the Lambda functions and ECS services. Implement stack updates with resource replacement for all components. Use AWS Secrets Manager to manage the configuration data."
   },
   {
    "l": "B",
    "t": "Use AWS CodeDeploy to manage deployments for the Lambda functions and ECS services. Implement canary deployments for the Lambda functions. Implement blue/green deployments for the ECS services. Use AWS Systems Manager Parameter Store to manage the configuration data."
   },
   {
    "l": "C",
    "t": "Use AWS Step Functions to orchestrate deployments for the Lambda functions and ECS services. Use canary deployments for the Lambda functions and ECS services in a different AWS Region. Use AWS Systems Manager Parameter Store to manage the configuration data."
   },
   {
    "l": "D",
    "t": "Use AWS Systems Manager to manage deployments for the Lambda functions and ECS services. Implement all-at-once deployments for the Lambda functions. Implement rolling updates for the ECS services. Use AWS Secrets Manager to manage the configuration data."
   }
  ],
  "ans": [
   "B"
  ],
  "multi": 1,
  "expl": [
   "CodeDeploy manages deployments for both Lambda and ECS: canary for Lambda (shift a small share of traffic before shifting everything), blue/green for ECS (run the new version in parallel, then switch traffic, with almost no downtime). Systems Manager Parameter Store manages configuration data. Everything is built-in functionality."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "A stack update with resource replacement has no gradual traffic shifting and can cause downtime."
   },
   {
    "l": "C",
    "t": "Step Functions orchestrating deployments and canaries in another Region has to be built by hand and is laborious."
   },
   {
    "l": "D",
    "t": "All-at-once for Lambda risks downtime if the new version is faulty."
   }
  ],
  "remember": "Lambda + ECS with one safe deployment tool = CodeDeploy.",
  "note": ""
 },
 {
  "n": 55,
  "title": "Lambda + API Gateway: revert to a stable version on errors, affecting the fewest customers",
  "summary": "Recent deployments caused errors affecting many customers. The solution must automatically return to the most recent stable version when errors are detected and affect as few customers as possible, in the most operationally efficient way.",
  "stem": "A DevOps team uses AWS CodePipeline, AWS CodeBuild, and AWS CodeDeploy to deploy an application. The application is a REST API that uses AWS Lambda functions and Amazon API Gateway. Recent deployments have introduced errors that have affected many customers.\n\nThe DevOps team needs a solution that reverts to the most recent stable version of the application when an error is detected. The solution must affect the fewest customers possible.\n\nWhich solution will meet these requirements with the MOST operational efficiency?",
  "opts": [
   {
    "l": "A",
    "t": "Set the deployment configuration in CodeDeploy to LambdaAllAtOnce. Configure automatic rollbacks on the deployment group. Create an Amazon CloudWatch alarm that detects HTTP Bad Gateway errors on API Gateway. Configure the deployment group to roll back when the number of alarms meets the alarm threshold."
   },
   {
    "l": "B",
    "t": "Set the deployment configuration in CodeDeploy to LambdaCanary10Percent10Minutes. Configure automatic rollbacks on the deployment group. Create an Amazon CloudWatch alarm that detects HTTP Bad Gateway errors on API Gateway. Configure the deployment group to roll back when the number of alarms meets the alarm threshold."
   },
   {
    "l": "C",
    "t": "Set the deployment configuration in CodeDeploy to LambdaAllAtOnce. Configure manual rollbacks on the deployment group. Create an Amazon Simple Notification Service (Amazon SNS) topic to send notifications every time a deployment fails. Configure the SNS topic to invoke a new Lambda function that stops the current deployment and starts the most recent successful deployment."
   },
   {
    "l": "D",
    "t": "Set the deployment configuration in CodeDeploy to LambdaCanary10Percent10Minutes. Configure manual rollbacks on the deployment group. Create a metric filter on an Amazon CloudWatch log group for API Gateway to monitor HTTP Bad Gateway errors. Configure the metric filter to invoke a new Lambda function that stops the current deployment and starts the most recent successful deployment."
   }
  ],
  "ans": [
   "B"
  ],
  "multi": 1,
  "expl": [
   "LambdaCanary10Percent10Minutes shifts only 10% of traffic to the new version during the first 10 minutes, so if it fails few customers are affected. A CloudWatch alarm watches for HTTP 502 Bad Gateway errors on API Gateway; automatic rollback on the deployment group returns to the stable version when the alarm fires."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "LambdaAllAtOnce shifts 100% of traffic immediately, so errors affect the most customers."
   },
   {
    "l": "C",
    "t": "Also all-at-once, and manual rollback via SNS + Lambda is complex and slow."
   },
   {
    "l": "D",
    "t": "Canary is right, but manual rollback with a metric filter + custom Lambda is more work than CodeDeploy's automatic rollback."
   }
  ],
  "remember": "Fewest customers affected + automatic rollback = canary + alarm + automatic rollback.",
  "note": ""
 },
 {
  "n": 56,
  "title": "Ensure VPC flow logs are always on for all existing and new VPCs",
  "summary": "Flow logs must always be configured for every existing and new VPC, including VPCs created by any IAM user (not only within a CloudFormation stack).",
  "stem": "A company needs to ensure that flow logs remain configured for all existing and new VPCs in its AWS account. The company uses an AWS CloudFormation stack to manage its VPCs. The company needs a solution that will work for any VPCs that any IAM user creates.\n\nWhich solution will meet these requirements?",
  "opts": [
   {
    "l": "A",
    "t": "Add the AWS::EC2::FlowLog resource to the CloudFormation stack that creates the VPCs."
   },
   {
    "l": "B",
    "t": "Create an organization in AWS Organizations. Add the company's AWS account to the organization. Create an SCP to prevent users from modifying VPC flow logs."
   },
   {
    "l": "C",
    "t": "Turn on AWS Config. Create an AWS Config rule to check whether VPC flow logs are turned on. Configure automatic remediation to turn on VPC flow logs."
   },
   {
    "l": "D",
    "t": "Create an IAM policy to deny the use of API calls for VPC flow logs. Attach the IAM policy to all IAM users."
   }
  ],
  "ans": [
   "C"
  ],
  "multi": 1,
  "expl": [
   "AWS Config continuously evaluates every VPC in the account. The managed rule vpc-flow-logs-enabled detects VPCs without flow logs; automatic remediation turns them back on, so flow logs are always maintained."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "Only applies to VPCs created by that CloudFormation stack and does not cover VPCs created outside the stack."
   },
   {
    "l": "B",
    "t": "An SCP only prevents modifying existing flow logs; it does not enable them for new VPCs, and setting up an organization is unnecessary."
   },
   {
    "l": "D",
    "t": "Blocking the flow-log API for all IAM users also prevents creating flow logs and enables flow logs for no VPC at all."
   }
  ],
  "remember": "Detect + self-fix configuration of every resource = AWS Config rule + auto remediation.",
  "note": ""
 },
 {
  "n": 57,
  "title": "Enforce encryption in transit for all existing S3 buckets",
  "summary": "Many S3 buckets in developer accounts allow unencrypted connections. Encryption in transit must be enforced for every existing bucket in the organization.",
  "stem": "A company uses an organization in AWS Organizations to manage several AWS accounts that the company's developers use. The company requires all data to be encrypted in transit.\n\nMultiple Amazon S3 buckets that were created in developer accounts allow unencrypted connections. A DevOps engineer must enforce encryption of data in transit for all existing S3 buckets that are created in accounts in the organization.\n\nWhich solution will meet these requirements?",
  "opts": [
   {
    "l": "A",
    "t": "Use AWS CloudFormation StackSets to deploy an AWS Network Firewall firewall to each account. Route all outbound requests from the AWS environment through the firewall. Deploy a policy to block access to all outbound requests on port 80."
   },
   {
    "l": "B",
    "t": "Use AWS CloudFormation StackSets to deploy an AWS Network Firewall firewall to each account. Route all inbound requests to the AWS environment through the firewall. Deploy a policy to block access to all inbound requests on port 80."
   },
   {
    "l": "C",
    "t": "Turn on AWS Config for the organization. Deploy a conformance pack that uses the s3-bucket-ssl-requests-only managed rule and an AWS Systems Manager Automation runbook. Use a runbook that adds a bucket policy statement to deny access to an S3 bucket when the value of the aws:SecureTransport condition key is false."
   },
   {
    "l": "D",
    "t": "Turn on AWS Config for the organization. Deploy a conformance pack that uses the s3-bucket-ssl-requests-only managed rule and an AWS Systems Manager Automation runbook. Use a runbook that adds a bucket policy statement to deny access to an S3 bucket when the value of the s3:x-amz-server-side-encryption-aws-kms-key-id condition key is null."
   }
  ],
  "ans": [
   "C"
  ],
  "multi": 1,
  "expl": [
   "Use AWS Config for the organization with a conformance pack that uses the managed rule s3-bucket-ssl-requests-only to flag non-compliant buckets. A Systems Manager Automation runbook remediates by adding a Deny statement to the bucket policy when aws:SecureTransport is false, blocking all unencrypted HTTP connections."
  ],
  "wrong": [
   {
    "l": "A and B",
    "t": "Network Firewall can block port 80 at the network layer but is complex and does not apply properly at the bucket level; blocking inbound (B) is also the wrong direction."
   },
   {
    "l": "D",
    "t": "The condition s3:x-amz-server-side-encryption-aws-kms-key-id relates to encryption at rest, not in transit."
   }
  ],
  "remember": "Force HTTPS for S3 = bucket policy Deny when aws:SecureTransport = false.",
  "note": ""
 },
 {
  "n": 58,
  "title": "Pipeline to build code, manage semantic versions and cache open-source libraries",
  "summary": "The company uses semantic versioning and needs a pipeline that builds code, manages build versions and caches the open-source libraries used during the build.",
  "stem": "A company is developing code and wants to use semantic versioning. The company's DevOps team needs to create a pipeline for compiling the code. The team also needs to manage versions of the compiled code. If the code uses any open source libraries, the libraries must also be cached in the build process.\n\nWhich solution will meet these requirements?",
  "opts": [
   {
    "l": "A",
    "t": "Create an AWS CodeArtifact repository and associate the upstream repositories. Create an AWS CodeBuild project that builds the semantic version of the code artifacts. Configure the project to authenticate and connect to the CodeArtifact repository and publish the artifact to the repository."
   },
   {
    "l": "B",
    "t": "Use AWS CodeDeploy to upload the generated semantic version of the artifact to an Amazon Elastic File System (Amazon EFS) file system."
   },
   {
    "l": "C",
    "t": "Use an AWS CodeBuild project to build the code and to publish the generated semantic version of the artifact to AWS Artifact. Configure build caching in the CodeBuild project."
   },
   {
    "l": "D",
    "t": "Create a new AWS CodeArtifact repository. Create an AWS Lambda function that pulls open source packages from the internet and publishes the packages to the repository. Configure AWS CodeDeploy to build semantic versions of the code and publish the versions to the repository."
   }
  ],
  "ans": [
   "A"
  ],
  "multi": 1,
  "expl": [
   "A CodeArtifact repository with upstream repositories (npm, PyPI, Maven, ...) automatically fetches and caches open-source libraries when code uses them, and supports semantic versioning for packages. CodeBuild builds the code, creates a semantic version for the artifact, authenticates and publishes it to the CodeArtifact repository."
  ],
  "wrong": [
   {
    "l": "B",
    "t": "CodeDeploy is for deployment, not for building or version management; EFS is not a package repository with versioning."
   },
   {
    "l": "C",
    "t": "CodeBuild's build cache only caches locally during builds; \"AWS Artifact\" is a compliance-report service, not a place to store build artifacts."
   },
   {
    "l": "D",
    "t": "Writing your own Lambda to pull packages from the internet is unnecessary when CodeArtifact has upstreams; CodeDeploy does not build versions."
   }
  ],
  "remember": "Cache open-source libraries + versioning = CodeArtifact (upstream).",
  "note": ""
 },
 {
  "n": 59,
  "title": "ECS EC2 launch type: task cannot be deployed because of missing permissions (awslogs)",
  "summary": "An ECS task (EC2 launch type) with the awslogs log driver cannot be deployed; the error message mentions missing permissions. The role used to launch the container instances already has logs:CreateLogGroup, CreateLogStream and PutLogEvents.",
  "stem": "A company uses Amazon Elastic Container Service (Amazon ECS) with an Amazon EC2 launch type. The company requires all log data to be centralized on Amazon CloudWatch. The company's ECS tasks include a LogConfiguration object that specifies a value of awslogs for the log driver name.\n\nThe company's ECS tasks failed to deploy. An error message indicates that a missing permission causes the failure. The company confirmed that the IAM role used to launch container instances includes the logs:CreateLogGroup, logs:CreateLogStream, and logs:PutLogEvents permissions.\n\nWhich solution will fix the problem?",
  "opts": [
   {
    "l": "A",
    "t": "Add an IAM trust policy to the IAM role that establishes Amazon ECS as a trusted service."
   },
   {
    "l": "B",
    "t": "Add the logs:PutDestination permission to the policy applied to the IAM role."
   },
   {
    "l": "C",
    "t": "Remove the logs:CreateLogStream permission from the policy applied to the IAM role."
   },
   {
    "l": "D",
    "t": "Add an IAM trust policy to the IAM role that establishes CloudWatch as a trusted service."
   }
  ],
  "ans": [
   "A"
  ],
  "multi": 1,
  "expl": [
   "The role already has enough permissions to write logs, but ECS cannot assume this role. An IAM role can only be used when its trust policy allows the corresponding service to assume it. You need to add a trust policy that sets Amazon ECS as a trusted service. Then ECS can use the existing permissions to create log streams and push logs to CloudWatch Logs."
  ],
  "wrong": [
   {
    "l": "B",
    "t": "logs:PutDestination is for log destinations shared across accounts and is unrelated to awslogs."
   },
   {
    "l": "C",
    "t": "Removing logs:CreateLogStream makes things worse because the driver needs this permission."
   },
   {
    "l": "D",
    "t": "CloudWatch is not the service that needs to assume this role; the party that assumes the role to run tasks is ECS."
   }
  ],
  "remember": "Permissions look sufficient but it still fails: check the trust policy (who may assume the role).",
  "note": ""
 },
 {
  "n": 60,
  "title": "Automatically delete old ECR images while keeping a minimum number",
  "summary": "Docker images (tagged and untagged) in ECR must be deleted automatically if they have not been updated for a long time and are rarely used, but at least a certain number of images must be kept, with the least operational effort.",
  "stem": "A company frequently creates Docker images of an application. The company stores the images in Amazon Elastic Container Registry (Amazon ECR). The company creates both tagged images and untagged images.\n\nThe company wants to implement a solution to automatically delete images that have not been updated for a long time and are not frequently used. The solution must retain at least a specified number of images.\n\nWhich solution will meet these requirements with the LEAST operational overhead?",
  "opts": [
   {
    "l": "A",
    "t": "Use Amazon S3 Lifecycle policies on the ECR repository to automatically delete images based on image age or the absence of tags on the image."
   },
   {
    "l": "B",
    "t": "Use Amazon ECR lifecycle policies to delete images based on age or the number of images that need to be retained in the repository."
   },
   {
    "l": "C",
    "t": "Configure an AWS Lambda function to run on a schedule to delete images based on age or the number of images that need to be retained in the repository."
   },
   {
    "l": "D",
    "t": "Use AWS Systems Manager to run a script by using the aws:executeScript action to automatically delete images based on image age or the absence of tags on the image."
   }
  ],
  "ans": [
   "B"
  ],
  "multi": 1,
  "expl": [
   "ECR lifecycle policies are a built-in feature: they delete images by age (days since push) or by the number of images to keep, for both tagged and untagged images. You only write a JSON rule and attach it to the repository."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "S3 lifecycle policies apply to S3 buckets, not ECR repositories."
   },
   {
    "l": "C",
    "t": "A scheduled Lambda requires you to write and maintain the code."
   },
   {
    "l": "D",
    "t": "Systems Manager with aws:executeScript is also a custom script and is not as good as a lifecycle policy."
   }
  ],
  "remember": "Cleaning up ECR images = lifecycle policy (by age or by count).",
  "note": ""
 },
 {
  "n": 61,
  "title": "Run a Chef cookbook periodically on EC2 without a Chef server",
  "summary": "A Linux EC2 fleet is managed with Systems Manager; the DevOps engineer writes a Chef cookbook to detect/remediate configuration drift and does not want to manage a Chef server and agents.",
  "stem": "A company manages a large fleet of Amazon EC2 Linux instances in its production AWS account by using AWS Systems Manager. The EC2 instances must comply with a list of compliance requirements.\n\nThe company's DevOps engineers wrote Chef cookbooks to detect and remediate configuration deviations. The company does not want to manage a Chef server and agent infrastructure.\n\nThe DevOps engineers need to set up the Chef cookbooks to run periodically on the EC2 instances.\n\nWhich solution will meet these requirements?",
  "opts": [
   {
    "l": "A",
    "t": "Create a Systems Manager State Manager association. Associate the AWS-ApplyChefRecipes document with all EC2 instances. Configure the association to retrieve the Chef cookbooks from a source repository and to run every hour."
   },
   {
    "l": "B",
    "t": "Store the Chef agent installation package in an Amazon S3 bucket. Configure a Systems Manager Run Command to invoke the AWS-InstallApplication command on all instances and to run the repair action. Schedule the Run Command to run every hour."
   },
   {
    "l": "C",
    "t": "Create a Systems Manager State Manager association that applies the AWS-RefreshAssociation document to all EC2 instances. Configure the association to run every hour."
   },
   {
    "l": "D",
    "t": "Configure a Systems Manager patch policy to run the scan and install operation every hour. Create a patch baseline for the EC2 instances. Configure the instance IAM profile with permissions for patch operations."
   }
  ],
  "ans": [
   "A"
  ],
  "multi": 1,
  "expl": [
   "A State Manager association attaches the AWS-ApplyChefRecipes document to every EC2 instance, fetches the cookbook from a source (S3, GitHub, ...) and schedules it to run every hour. This document runs Chef in local chef-client mode, so no Chef server or separate agent infrastructure is needed."
  ],
  "wrong": [
   {
    "l": "B",
    "t": "Installing the Chef agent with AWS-InstallApplication and Run Command is manual and recreates the agent infrastructure the company doesn't want to manage."
   },
   {
    "l": "C",
    "t": "AWS-RefreshAssociation only refreshes other associations; it does not run cookbooks."
   },
   {
    "l": "D",
    "t": "Patch Manager patches the operating system; it does not run Chef cookbooks."
   }
  ],
  "remember": "Chef on EC2 without a server = State Manager + AWS-ApplyChefRecipes.",
  "note": ""
 },
 {
  "n": 62,
  "title": "Cheapest EC2 batch image-processing cluster (no containers)",
  "summary": "The application cannot run in Docker, must run on EC2, stores checkpoints on an NFS volume and can tolerate interruptions; configuring the cluster software from a generic Linux image takes 30 minutes.",
  "stem": "A DevOps engineer is researching the least expensive way to implement an image batch processing cluster on AWS. The application cannot run in Docker containers and must run on Amazon EC2. The batch job stores checkpoint data on an NFS volume and can tolerate interruptions. Configuring the cluster software from a generic EC2 Linux image takes 30 minutes.\n\nWhat is the MOST cost-effective solution?",
  "opts": [
   {
    "l": "A",
    "t": "Use Amazon EFS for checkpoint data. To complete the job, use an EC2 Auto Scaling group and an On-Demand pricing model to provision EC2 instances temporarily."
   },
   {
    "l": "B",
    "t": "Use GlusterFS on EC2 instances for checkpoint data. To run the batch job, configure EC2 instances manually. When the job completes, shut down the instances manually."
   },
   {
    "l": "C",
    "t": "Use Amazon EFS for checkpoint data. Use EC2 Fleet to launch EC2 Spot Instances, and utilize user data to configure the EC2 Linux instance on startup."
   },
   {
    "l": "D",
    "t": "Use Amazon EFS for checkpoint data. Use EC2 Fleet to launch EC2 Spot Instances. Create a custom AMI for the cluster and use the latest AMI when creating instances."
   }
  ],
  "ans": [
   "D"
  ],
  "multi": 1,
  "expl": [
   "Amazon EFS is managed NFS and its data persists independently of instances, so when a Spot Instance is reclaimed, the job resumes from its checkpoint. EC2 Fleet with Spot is the cheapest option for interruption-tolerant batch workloads. A custom AMI with the cluster software pre-installed lets each instance start quickly, without paying for 30 minutes of configuration time."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "On-Demand is more expensive than Spot; an ASG for temporary batch jobs is not cost-optimal."
   },
   {
    "l": "B",
    "t": "Self-managed GlusterFS and manually configuring and shutting down instances is laborious and wasteful."
   },
   {
    "l": "C",
    "t": "Configuring through user data takes 30 minutes on every launch, which costs more than a custom AMI."
   }
  ],
  "remember": "Interruption-tolerant batch: Spot + durable data outside the instance (EFS) + pre-built AMI.",
  "note": ""
 },
 {
  "n": 63,
  "title": "EKS: service account gets Access Denied (403) when fetching a secret from Secrets Manager",
  "summary": "Secrets are encrypted with a KMS customer managed key. A Kubernetes service account assumes an IAM role to fetch the secret but receives 403 Forbidden.",
  "stem": "A company uses an Amazon Elastic Kubernetes Service (Amazon EKS) cluster to deploy its web applications on containers. The web applications contain confidential data that cannot be decrypted without specific credentials.\n\nA DevOps engineer has stored the credentials in AWS Secrets Manager. The secrets are encrypted by an AWS Key Management Service (AWS KMS) customer managed key. A Kubernetes service account for a third-party tool makes the secrets available to the applications. The service account assumes an IAM role that the company created to access the secrets.\n\nThe service account receives an Access Denied (403 Forbidden) error while trying to retrieve the secrets from Secrets Manager.\n\nWhat is the root cause of this issue?",
  "opts": [
   {
    "l": "A",
    "t": "The IAM role that is attached to the EKS cluster does not have access to retrieve the secrets from Secrets Manager."
   },
   {
    "l": "B",
    "t": "The key policy for the customer managed key does not allow the Kubernetes service account IAM role to use the key."
   },
   {
    "l": "C",
    "t": "The key policy for the customer managed key does not allow the EKS cluster IAM role to use the key."
   },
   {
    "l": "D",
    "t": "The IAM role that is assumed by the Kubernetes service account does not have permission to access the EKS cluster."
   }
  ],
  "ans": [
   "B"
  ],
  "multi": 1,
  "expl": [
   "The secret is encrypted with a KMS customer managed key, so to decrypt it when retrieving the secret, the IAM role that the service account assumes must have permission to use the key. For a customer managed key, the key policy is the primary access-control mechanism. A key policy that does not allow the service account's role to use the key (missing kms:Decrypt, ...) causes Access Denied even if the role has Secrets Manager permissions."
  ],
  "wrong": [
   {
    "l": "A and C",
    "t": "A role attached to the EKS cluster/nodes is not the role the service account uses to fetch the secret."
   },
   {
    "l": "D",
    "t": "Access to the EKS cluster is irrelevant because the service account fetches the secret from Secrets Manager."
   }
  ],
  "remember": "Secrets Manager 403 with a CMK: check the role's IAM policy AND the KMS key policy.",
  "note": ""
 },
 {
  "n": 64,
  "title": "Package code on merge and use the package as an upstream source for later packages",
  "summary": "The Git provider is compatible with AWS Code services. Code must be packaged on merge, and that package must be an upstream source for later packages.",
  "stem": "A company uses a Git provider that is compatible with AMS Code services with credential authentication support as version control for application code. The company wants to package the code and make it available when it is merged. The packaged code must be available as an upstream source for future packaged code.\n\nWhich combination of steps will meet these requirements? (Select TWO.)",
  "opts": [
   {
    "l": "A",
    "t": "Create an AWS Secrets Manager secret that holds the Git provider credentials. Create an AWS CodeBuild project that integrates with the Git repository by using the Secrets Manager secret and a corresponding webhook."
   },
   {
    "l": "B",
    "t": "Create an AWS Parameter Store secure string parameter that holds the Git provider credentials. Create an AWS CodeBuild project that integrates with the Git repository by using the secure string parameter and a corresponding webhook."
   },
   {
    "l": "C",
    "t": "Create an AWS Secrets Manager secret that holds the Git provider credentials. Create an AWS CodeBuild project that define a Secrets Manager environment variable in the buildspec. Use the environment variable to configure a mirror of the Git repository during the install phase."
   },
   {
    "l": "D",
    "t": "Create an AWS CodeArtifact domain and repository. Configure the AWS CodeBuild project to package the CodeBuild project's output artifact and upload the artifact to the CodeArtifact repository."
   },
   {
    "l": "E",
    "t": "Create an Amazon S3 bucket. Configure the AWS CodeBuild project to package and upload the artifact to the S3 bucket."
   }
  ],
  "ans": [
   "A",
   "D"
  ],
  "multi": 2,
  "expl": [
   "A: Secrets Manager stores the Git provider credentials; a CodeBuild project integrates with the repository through the secret and a webhook, so every merge builds and packages automatically.",
   "D: A CodeArtifact domain and repository: CodeBuild packages the output artifact and uploads it to the repository. CodeArtifact supports upstreams, so a published package can be used as an upstream source for later packages (S3 has no such feature)."
  ],
  "wrong": [
   {
    "l": "B",
    "t": "Parameter Store is not where Git credentials are stored for CodeBuild when used with a webhook."
   },
   {
    "l": "C",
    "t": "Configuring a mirror during the install phase does not trigger a build on merge and does not package the code."
   },
   {
    "l": "E",
    "t": "S3 only stores files and does not support upstream sources for packages."
   }
  ],
  "remember": "A webhook triggers the build on merge; CodeArtifact is the package repository with upstreams.",
  "note": ""
 },
 {
  "n": 65,
  "title": "ECS blue/green: shift traffic in equal steps, fully automatically",
  "summary": "An ECS cluster behind an ALB uses CodePipeline and CodeDeploy blue/green. Traffic must shift automatically in equal steps over a predefined total time, with no manual intervention and no downtime.",
  "stem": "A software as a service (SaaS) company uses an Amazon Elastic Container Service (Amazon ECS) cluster behind an Application Load Balancer (ALB) to provide real-time analytics services to clients. The company is using AWS CodePipeline and AWS CodeDeploy to set up a blue/green deployment process for the solution.\n\nThe company wants the deployment process to automatically shift traffic in equal increments over a specified total deployment time without any manual intervention. The deployment process must ensure zero downtime and provide seamless updates.\n\nWhich solution will meet these requirements?",
  "opts": [
   {
    "l": "A",
    "t": "Set the TrafficRoutingConfig parameter to TimeBasedLinear in the appspec.yaml file of the CodeDeploy application that the company uses to deploy the ECS services. Set values for the linearPercentage parameter and the linearInterval parameter."
   },
   {
    "l": "B",
    "t": "Update the TrafficRoutingConfig parameter of the appspec.yaml file of the CodeDeploy application that the company uses to deploy the ECS services to the AllAtOnce type."
   },
   {
    "l": "C",
    "t": "Create a deployment group configuration. Set the TrafficRoutingConfig parameter to the TimeBasedCanary type. Configure listener rules on the ALB to forward traffic to the target groups based on specified weights."
   },
   {
    "l": "D",
    "t": "Set up a deployment configuration in CodeDeploy. Configure weighted routing on the ALB during deployment."
   }
  ],
  "ans": [
   "A"
  ],
  "multi": 1,
  "expl": [
   "CodeDeploy's linear type: a TrafficRoutingConfig of type TimeBasedLinear in the appspec.yaml for ECS blue/green. linearPercentage sets the percentage of traffic added at each step and linearInterval sets the minutes between steps, so traffic shifts evenly and automatically; blue/green keeps downtime at zero."
  ],
  "wrong": [
   {
    "l": "B",
    "t": "AllAtOnce shifts 100% of traffic at once."
   },
   {
    "l": "C",
    "t": "TimeBasedCanary has only two steps (a small share, then the rest), not equal steps; configuring ALB listener rules yourself is unnecessary."
   },
   {
    "l": "D",
    "t": "Manual weighted routing on the ALB is not controlled by CodeDeploy over time."
   }
  ],
  "remember": "Linear = equal steps; Canary = two steps; AllAtOnce = one step.",
  "note": ""
 },
 {
  "n": 66,
  "title": "SNS notification when a Control Tower Account Factory account is created successfully",
  "summary": "A Lambda function creates accounts through the Service Catalog API (Account Factory). An SNS notification must be published when the account creation process finishes successfully.",
  "stem": "A company uses AWS Control Tower to manage its multi-account AWS environment. The company has historically created AWS accounts by using AWS Control Tower through the AWS Management Console. The company wants to implement an automated solution that will create new AWS accounts by using AWS Control Tower Account Factory.\n\nA DevOps engineer is testing a new approach in which employees will upload a .csv file into an Amazon S3 bucket. The .csv file will contain the information that is necessary to create a new AWS account. An AWS Lambda function will process event notifications from Amazon S3 when new files are created in the S3 bucket. The Lambda function will create the AWS account by using the AWS Service Catalog APIs.\n\nThe DevOps engineer needs to implement a solution to publish a notification to an Amazon Simple Notification Service (Amazon SNS) topic when the account creation process ends successfully.\n\nWhat should the DevOps engineer do to automate the SNS notification?",
  "opts": [
   {
    "l": "A",
    "t": "Configure AWS Control Tower to publish to the SNS topic when the automatic drift detection feature identifies that a new account has been added to the service."
   },
   {
    "l": "B",
    "t": "Configure the AWS Control Tower Account Factory product in AWS Service Catalog to publish to the SNS topic when a new account product is launched with the service."
   },
   {
    "l": "C",
    "t": "Configure an Amazon EventBridge rule that reacts to the AWS Service Catalog ProvisionProduct event and publishes to the SNS topic."
   },
   {
    "l": "D",
    "t": "Configure an Amazon EventBridge rule that reacts to the AWS Control Tower CreateManagedAccount event and publishes to the SNS topic."
   }
  ],
  "ans": [
   "D"
  ],
  "multi": 1,
  "expl": [
   "Control Tower emits a CreateManagedAccount event to EventBridge when the account creation process (including through Account Factory/Service Catalog) completes, with a success or failure status. An EventBridge rule matches this event with an SNS topic as the target."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "Drift detection finds configuration drift in the landing zone; it does not report that a new account has been created."
   },
   {
    "l": "B",
    "t": "The Account Factory product in Service Catalog has no option to publish SNS notifications by itself."
   },
   {
    "l": "C",
    "t": "ProvisionProduct only shows that the product launch has started; it does not confirm the account has been created."
   }
  ],
  "remember": "Control Tower account creation finished = CreateManagedAccount event.",
  "note": ""
 },
 {
  "n": 67,
  "title": "Geographically isolated DR with 4-hour RTO and 15-minute RPO (RDS for MySQL)",
  "summary": "A web app on EC2/ALB/ASG across multiple AZs uses RDS for MySQL; a Route 53 alias points to the ALB. A geographically isolated DR site with a 4-hour RTO and 15-minute RPO is needed, with the fewest changes to the application stack.",
  "stem": "A company manages a web application that runs on Amazon EC2 instances behind an Application Load Balancer (ALB). The EC2 instances run in an Auto Scaling group across multiple Availability Zones. The application uses an Amazon RDS for MySQL DB instance to store the data. The company has configured Amazon Route 53 with an alias record that points to the ALB.\n\nA new company guideline requires a geographically isolated disaster recovery (DR) site with an RTO of 4 hours and an RPO of 15 minutes.\n\nWhich DR strategy will meet these requirements with the LEAST change to the application stack?",
  "opts": [
   {
    "l": "A",
    "t": "Launch a replica environment of everything except Amazon RDS in a different Availability Zone. Create an RDS read replica in the new Availability Zone, and configure the new stack to point to the local RDS DB instance. Add the new stack to the Route 53 record set by using a health check to configure a failover routing policy."
   },
   {
    "l": "B",
    "t": "Launch a replica environment of everything except Amazon RDS in a different AWS Region. Create an RDS read replica in the new Region, and configure the new stack to point to the local RDS DB instance. Add the new stack to the Route 53 record set by using a health check to configure a latency routing policy."
   },
   {
    "l": "C",
    "t": "Launch a replica environment of everything except Amazon RDS in a different AWS Region. In the event of an outage, copy and restore the latest RDS snapshot from the primary Region to the DR Region. Adjust the Route 53 record set to point to the ALB in the DR Region."
   },
   {
    "l": "D",
    "t": "Launch a replica environment of everything except Amazon RDS in a different AWS Region. Create an RDS read replica in the new Region, and configure the new environment to point to the local RDS DB instance. Add the new stack to the Route 53 record set by using a health check to configure a failover routing policy. In the event of an outage, promote the read replica to primary."
   }
  ],
  "ans": [
   "D"
  ],
  "multi": 1,
  "expl": [
   "Geographic isolation means a different Region. A cross-Region RDS read replica replicates continuously (asynchronously, with very low lag), meeting the 15-minute RPO. Route 53 failover routing with health checks follows an active-passive model; during an outage, promote the read replica to primary, which completes within the 4-hour RTO. You only need to build a copy of the stack and a read replica, so changes are minimal."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "A different AZ is still within the same Region, so it is not geographically isolated."
   },
   {
    "l": "B",
    "t": "Latency routing sends traffic to both Regions, and a read replica cannot be written to until promoted; this is not a DR failover model."
   },
   {
    "l": "C",
    "t": "Copying/restoring snapshots cannot guarantee a 15-minute RPO (automated snapshots only run daily)."
   }
  ],
  "remember": "Cross-Region RDS DR with a small RPO: cross-Region read replica + failover routing + promote.",
  "note": ""
 },
 {
  "n": 68,
  "title": "Disable credentials of new IAM users and notify the security team",
  "summary": "Everyone uses IAM Identity Center; a new IAM user is anomalous. The credentials of any new IAM user must be disabled immediately and the security team notified.",
  "stem": "A DevOps engineer at a company is supporting an AWS environment in which all users use AWS IAM Identity Center. The company wants to immediately disable credentials of any new IAM user and wants the security team to receive a notification.\n\nWhich combination of steps should the DevOps engineer take to meet these requirements? (Select THREE.)",
  "opts": [
   {
    "l": "A",
    "t": "Create an Amazon EventBridge rule that reacts to an IAM CreateUser API call in AWS CloudTrail."
   },
   {
    "l": "B",
    "t": "Create an Amazon EventBridge rule that reacts to an IAM GetLoginProfile API call in AWS CloudTrail."
   },
   {
    "l": "C",
    "t": "Create an AWS Lambda function that is a target of the EventBridge rule. Configure the Lambda function to disable any access keys and delete the login profiles that are associated with the IAM user."
   },
   {
    "l": "D",
    "t": "Create an AWS Lambda function that is a target of the EventBridge rule. Configure the Lambda function to delete the login profiles that are associated with the IAM user."
   },
   {
    "l": "E",
    "t": "Create an Amazon Simple Notification Service (Amazon SNS) topic that is a target of the EventBridge rule. Subscribe the security team's group email address to the topic."
   },
   {
    "l": "F",
    "t": "Create an Amazon Simple Queue Service (Amazon SQS) queue that is a target of the Lambda function. Subscribe the security team's group email address to the queue."
   }
  ],
  "ans": [
   "A",
   "C",
   "E"
  ],
  "multi": 3,
  "expl": [
   "A: An EventBridge rule reacting to the CreateUser API call in CloudTrail detects a new IAM user immediately.",
   "C: A Lambda function is the rule's target and disables the user's access keys and deletes the login profile. An IAM user's credentials are access keys (programmatic access) and the console password (login profile); both must be handled.",
   "E: An SNS topic is a target of the rule, with the security team's email subscribed; SNS supports direct email subscriptions."
  ],
  "wrong": [
   {
    "l": "B",
    "t": "GetLoginProfile is only a read call and does not signal creation of a new user."
   },
   {
    "l": "D",
    "t": "Deleting only the login profile and ignoring access keys leaves the user with API credentials."
   },
   {
    "l": "F",
    "t": "SQS does not support email subscriptions, so it cannot send notifications to a group email."
   }
  ],
  "remember": "An IAM user has two kinds of credentials: console password (login profile) and access keys.",
  "note": ""
 },
 {
  "n": 69,
  "title": "Centrally configure AWS Config and record resource changes in one central account",
  "summary": "AWS Config is currently configured manually in each account. It must be configured centrally for every account in the organization, and resource changes recorded into one central account.",
  "stem": "A company has its AWS accounts in an organization in AWS Organizations. AWS Config is manually configured in each AWS account. The company needs to implement a solution to centrally configure AWS Config for all accounts in the organization. The solution also must record resource changes to a central account.\n\nWhich combination of actions should a DevOps engineer perform to meet these requirements? (Select TWO.)",
  "opts": [
   {
    "l": "A",
    "t": "Configure a delegated administrator account for AWS Config. Enable trusted access for AWS Config in the organization."
   },
   {
    "l": "B",
    "t": "Configure a delegated administrator account for AWS Config. Create a service-linked role for AWS Config in the organization's management account."
   },
   {
    "l": "C",
    "t": "Create an AWS CloudFormation template to create an AWS Config aggregator. Configure a CloudFormation stack set to deploy the template to all accounts in the organization."
   },
   {
    "l": "D",
    "t": "Create an AWS Config organization aggregator in the organization's management account. Configure data collection from all AWS accounts in the organization and from all AWS Regions."
   },
   {
    "l": "E",
    "t": "Create an AWS Config organization aggregator in the delegated administrator account. Configure data collection from all AWS accounts in the organization and from all AWS Regions."
   }
  ],
  "ans": [
   "A",
   "E"
  ],
  "multi": 2,
  "expl": [
   "A: Designate a delegated administrator for AWS Config and enable trusted access for AWS Config in the organization, so Config works across the organization and is managed centrally from a dedicated account rather than the management account.",
   "E: Create an organization aggregator in the delegated administrator account that collects data from all accounts and all Regions, gathering resource changes into the central account."
  ],
  "wrong": [
   {
    "l": "B",
    "t": "A service-linked role in the management account does not enable centralized management for the organization; trusted access is what is needed."
   },
   {
    "l": "C",
    "t": "Creating an aggregator through StackSets for each account is manual and not the right centralized approach."
   },
   {
    "l": "D",
    "t": "Creating the aggregator in the management account is not best practice; a delegated administrator should be used."
   }
  ],
  "remember": "Organization-wide Config: trusted access + delegated admin + organization aggregator.",
  "note": ""
 },
 {
  "n": 70,
  "title": "ECS EC2 launch type: task cannot be placed because of awslogs configuration",
  "summary": "An application is moved to ECS (EC2 launch type) and logs are collected into CloudWatch in us-west-2; no log group exists yet. The task reports \"unable to place a task because no container instance met all of its requirements\". The task definition uses awslogs with awslogs-create-group = true, non-blocking mode, and max-buffer-size 25m.",
  "stem": "A company is migrating an application to Amazon Elastic Container Service (Amazon ECS). The company wants to consolidate log data in Amazon CloudWatch in the us-west-2 Region. No CloudWatch log groups currently exist for Amazon ECS.\n\nThe company receives the following error code when an ECS task attempts to launch: \"service my-service-name was unable to place a task because no container instance met all of its requirements.\" The ECS task definition includes the following container log configuration:\n\n```json\n\"logConfiguration\": {\n  \"logDriver\": \"awslogs\",\n  \"options\": {\n    \"awslogs-create-group\": \"true\",\n    \"awslogs-group\": \"awslogs-mytask\",\n    \"awslogs-region\": \"us-west-2\",\n    \"awslogs-stream-prefix\": \"awslogs-mytask\",\n    \"mode\": \"non-blocking\",\n    \"max-buffer-size\": \"25m\"\n  }\n}\n```\n\nThe ECS cluster uses an Amazon EC2 Auto Scaling group to provide capacity for tasks. EC2 instances launch an Amazon ECS-optimized AMI.\n\nWhich solution will fix the problem?",
  "opts": [
   {
    "l": "A",
    "t": "Modify the ECS infrastructure IAM role to add the logs:CreateLogStream and logs:PutLogEvents permissions."
   },
   {
    "l": "B",
    "t": "Modify the ECS log configuration to use blocking mode."
   },
   {
    "l": "C",
    "t": "Modify the ECS container instance IAM role to add the logs:CreateLogStream and logs:PutLogEvents permissions."
   },
   {
    "l": "D",
    "t": "Modify the ECS log configuration by setting the awslogs-create-group option to false."
   }
  ],
  "ans": [
   "C"
  ],
  "multi": 1,
  "expl": [
   "With the EC2 launch type, log-writing permissions come from the container instance IAM role (the role the EC2 instances use to run the ECS agent). The role needs logs:CreateLogStream and logs:PutLogEvents. Without these permissions, no instance can satisfy the task's logging configuration, so ECS cannot place the task. Note: because awslogs-create-group is true and no log group exists yet, the role also needs logs:CreateLogGroup. Option C does not mention this permission, so check whether the role already has it."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "The ECS infrastructure role is for ECS to manage resources such as load balancers or volumes; it is not the role the log driver uses to write logs."
   },
   {
    "l": "B",
    "t": "Blocking/non-blocking mode only affects how logs are buffered and is unrelated to the placement error."
   },
   {
    "l": "D",
    "t": "Setting awslogs-create-group to false makes the failure worse because no log group exists yet."
   }
  ],
  "remember": "EC2 launch type: log permissions live on the container instance role (or the task execution role if used).",
  "note": ""
 },
 {
  "n": 71,
  "title": "Ensure all existing and future S3 buckets have encryption, logging, versioning and are not public",
  "summary": "The dev team creates new buckets every day. Security needs every existing and future bucket to have encryption, logging and versioning enabled and never be publicly readable or writable.",
  "stem": "A company uses Amazon S3 to store proprietary information. The development team creates buckets for new projects on a daily basis. The security team wants to ensure that all existing and future buckets have encryption, logging, and versioning enabled. Additionally, no buckets should ever be publicly read or write accessible.\n\nWhat should a DevOps engineer do to meet these requirements?",
  "opts": [
   {
    "l": "A",
    "t": "Enable AWS CloudTrail and configure automatic remediation using AWS Lambda."
   },
   {
    "l": "B",
    "t": "Enable AWS Config rules and configure automatic remediation using AWS Systems Manager documents."
   },
   {
    "l": "C",
    "t": "Enable AWS Trusted Advisor and configure automatic remediation using Amazon EventBridge."
   },
   {
    "l": "D",
    "t": "Enable AWS Systems Manager and configure automatic remediation using Systems Manager documents."
   }
  ],
  "ans": [
   "B"
  ],
  "multi": 1,
  "expl": [
   "AWS Config continuously evaluates the configuration of every bucket, existing and new. Use Config rules (s3-bucket-server-side-encryption-enabled, s3-bucket-logging-enabled, s3-bucket-versioning-enabled, s3-bucket-public-read-prohibited, s3-bucket-public-write-prohibited) and automatic remediation with Systems Manager Automation documents to automatically enable encryption, logging, versioning or block public access."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "CloudTrail only records API calls and does not evaluate configuration state; writing your own Lambda is laborious."
   },
   {
    "l": "C",
    "t": "Trusted Advisor only gives recommendations and does not fully check these requirements; remediation through EventBridge must be built by hand."
   },
   {
    "l": "D",
    "t": "Systems Manager cannot evaluate S3 configuration compliance; that is AWS Config's job."
   }
  ],
  "remember": "Config rules + Automation remediation = continuous compliance + self-fixing.",
  "note": ""
 },
 {
  "n": 72,
  "title": "Deploy different CloudFormation templates per OU for new accounts",
  "summary": "The organization uses multiple OUs. CloudFormation templates must be deployed automatically to new accounts, with the specific templates varying by OU, using the least operational effort.",
  "stem": "A company uses an organization in AWS Organizations to manage multiple AWS accounts in multiple OUs. The company is planning to implement a comprehensive account management solution and wants to ensure consistent baseline configurations.\n\nA DevOps engineer is developing a solution to automatically deploy AWS CloudFormation templates to new AWS accounts. The specific CloudFormation template that the solution deploys must vary based on which organizational unit (OU) each new account is placed in.\n\nWhich solution will meet these requirements with the LEAST operational overhead?",
  "opts": [
   {
    "l": "A",
    "t": "Enable AWS Control Tower. Use Customizations for AWS Control Tower (CfCT) to deploy each CloudFormation template from a centralized account. Create a CodeCommit repository to store the entire configuration package, including the CloudFormation templates and a manifest file that maps each CloudFormation template to its corresponding OU."
   },
   {
    "l": "B",
    "t": "Enable AWS Control Tower. Build a pipeline in AWS CodePipeline to deploy the CloudFormation deployment from a centralized account. Create a CodeCommit repository to store the entire configuration package, including the CloudFormation templates and a manifest file that maps each CloudFormation template to its corresponding OU. After the code is updated in CodeCommit, initiate the pipeline and deploy the CloudFormation templates to the new AWS accounts."
   },
   {
    "l": "C",
    "t": "Store the CloudFormation templates in an Amazon S3 bucket by using a separate prefix for each AWS account. Create an AWS Lambda function that deploys a specific CloudFormation template to each new AWS account based on the prefix path that indicates where each template is located in the S3 bucket."
   },
   {
    "l": "D",
    "t": "Store CloudFormation templates in an Amazon S3 bucket. Create an AWS Lambda function that deploys a specific CloudFormation template to the new AWS accounts based on the OU each new account is in. Create an Amazon EventBridge rule that matches \"eventName\": \"CreateAccountResult\" and \"state\": \"SUCCEEDED.\" Set the Lambda function as the target of the EventBridge rule."
   }
  ],
  "ans": [
   "A"
  ],
  "multi": 1,
  "expl": [
   "Customizations for AWS Control Tower (CfCT) is a ready-made solution: you store a configuration package (templates and a manifest file mapping each template to an OU) in a repository. When a new account is created or moved into an OU, CfCT automatically deploys the correct templates for that OU; the pipeline is pre-built by CfCT."
  ],
  "wrong": [
   {
    "l": "B",
    "t": "Building your own CodePipeline and triggering it manually when code changes is more work; CfCT already does this."
   },
   {
    "l": "C",
    "t": "Storing templates under a prefix per account and writing your own Lambda is manual and not tied to OUs."
   },
   {
    "l": "D",
    "t": "Could work, but you would have to write and maintain Lambda and EventBridge rules."
   }
  ],
  "remember": "Per-OU baseline for new accounts = CfCT with a manifest file.",
  "note": ""
 },
 {
  "n": 73,
  "title": "Java package repository on AWS, populated only from the on-premises repository over a private network",
  "summary": "A Java workload on EC2 in a VPC is connected to on-premises with a Site-to-Site VPN. A local repository on AWS is needed, packages must be retrieved over a private network, and the repository on AWS may only be populated from the on-premises repository.",
  "stem": "A company is moving Java workloads to Amazon EC2 instances in a VPC that has public and private subnets. The EC2 instances run in private subnets. The company uses an AWS Site-to-Site VPN connection to configure private connectivity between an on-premises network and the VPC.\n\nThe company experienced performance issues when frequently retrieving packages from the on-premises repositories. The company wants to create local repositories that are hosted on AWS. Any package retrieval must be over a private network. The AWS hosted repositories must be populated from only the on-premises repositories.\n\nWhich solution will meet these requirements?",
  "opts": [
   {
    "l": "A",
    "t": "Create a VPC endpoint for AWS CodeArtifact in the VPC. Create a CodeArtifact repository. Set up a package group configuration in CodeArtifact that has EXTERNAL_UPSTREAM = BLOCK, INTERNAL_UPSTREAM = ALLOW, and PUBLISH = ALLOW origin controls."
   },
   {
    "l": "B",
    "t": "Create a NAT gateway in each public subnet. Modify each private subnet route table to allow traffic to 0.0.0.0/0 through the NAT gateway in the public subnets. Set up a package group configuration in AWS CodeArtifact that has EXTERNAL_UPSTREAM = BLOCK, INTERNAL_UPSTREAM = ALLOW, and PUBLISH = BLOCK origin controls."
   },
   {
    "l": "C",
    "t": "Create a VPC endpoint for Amazon Elastic Container Registry (Amazon ECR) in the VPC. Set up an ECR private repository. Create a pull through cache rule that has an associated connection to the on-premises repository."
   },
   {
    "l": "D",
    "t": "Create a VPC endpoint for AWS CodeArtifact in the VPC. Create a CodeArtifact repository. Use the AssociateExternalConnection API to create a connection between the CodeArtifact repository and the on-premises repository."
   }
  ],
  "ans": [
   "A"
  ],
  "multi": 1,
  "expl": [
   "A VPC endpoint for CodeArtifact lets instances reach the repository over a private network without going to the internet. A package group with EXTERNAL_UPSTREAM = BLOCK prevents pulling packages from external public repositories; PUBLISH = ALLOW allows packages to be pushed from on-premises over the VPN connection, so the repository is only populated from on-premises; INTERNAL_UPSTREAM = ALLOW allows the use of internal upstreams."
  ],
  "wrong": [
   {
    "l": "B",
    "t": "A NAT gateway sends traffic to the internet, contradicting the private-network requirement; PUBLISH = BLOCK would cut off the path for populating from on-premises."
   },
   {
    "l": "C",
    "t": "ECR is for container images, not Java packages; pull-through cache does not support on-premises repositories."
   },
   {
    "l": "D",
    "t": "CodeArtifact external connections only support certain public repositories (npm, PyPI, Maven Central, ...), not on-premises connections."
   }
  ],
  "remember": "Private CodeArtifact: VPC endpoint + package group origin controls.",
  "note": ""
 },
 {
  "n": 74,
  "title": "Prevent patching from filling EC2 disks (Systems Manager Automation)",
  "summary": "In the most recent patch cycle, many Linux EC2 instances went into an error state because of insufficient disk space. Sufficient space must be ensured in the next patch run.",
  "stem": "A company has a fleet of Amazon EC2 instances that run Linux in a single AWS account. The company is using an AWS Systems Manager Automation task across the EC2 instances.\n\nDuring the most recent patch cycle, several EC2 instances went into an error state because of insufficient available disk space. A DevOps engineer needs to ensure that the EC2 instances have sufficient available disk space during the patching process in the future.\n\nWhich combination of steps will meet these requirements? (Select TWO.)",
  "opts": [
   {
    "l": "A",
    "t": "Ensure that the Amazon CloudWatch agent is installed on all EC2 instances."
   },
   {
    "l": "B",
    "t": "Create a cron job that is installed on each EC2 instance to periodically delete temporary files."
   },
   {
    "l": "C",
    "t": "Create an Amazon CloudWatch log group for the EC2 instances. Configure a cron job that is installed on each EC2 instance to write the available disk space to a CloudWatch log stream for the relevant EC2 instance."
   },
   {
    "l": "D",
    "t": "Create an Amazon CloudWatch alarm to monitor available disk space on all EC2 instances. Add the alarm as a safety control to the Systems Manager Automation task."
   },
   {
    "l": "E",
    "t": "Create an AWS Lambda function to periodically check for sufficient available disk space on all EC2 instances by evaluating each EC2 instance's respective Amazon CloudWatch log stream."
   }
  ],
  "ans": [
   "A",
   "D"
  ],
  "multi": 2,
  "expl": [
   "A: By default CloudWatch has no disk-space metric. The CloudWatch agent collects metrics (such as disk_used_percent) and sends them to CloudWatch.",
   "D: A CloudWatch alarm monitors disk space and is attached as a safety control (stop alarm) for Automation. If disk space is low, the alarm enters the ALARM state and Automation stops itself, so patching doesn't happen when there isn't room and instances don't fall into an error state."
  ],
  "wrong": [
   {
    "l": "B",
    "t": "A cron job deleting temporary files does not guarantee enough space and does not check conditions before patching."
   },
   {
    "l": "C",
    "t": "Writing disk usage to a log stream with cron is roundabout and cannot stop patching when the disk is full."
   },
   {
    "l": "E",
    "t": "A Lambda function checking logs periodically must be built by hand and does not integrate directly as a stop condition for Automation."
   }
  ],
  "remember": "Automation safety control = CloudWatch alarm; disk metrics need the CloudWatch agent.",
  "note": ""
 },
 {
  "n": 75,
  "title": "CloudFormation deployment policy: tags, resource limits, 2 Regions, multiple versions",
  "summary": "The company has strict requirements for tags and resources, limits deployments to two Regions, and developers need to deploy multiple versions of the same application.",
  "stem": "A company wants to use AWS CloudFormation for infrastructure deployment. The company has strict tagging and resource requirements and wants to limit the deployment to two Regions. Developers will need to deploy multiple versions of the same application.\n\nWhich solution ensures resources are deployed in accordance with company policy?",
  "opts": [
   {
    "l": "A",
    "t": "Create AWS Trusted Advisor checks to find and remediate unapproved CloudFormation StackSets."
   },
   {
    "l": "B",
    "t": "Create a CloudFormation drift detection operation to find and remediate unapproved CloudFormation StackSets."
   },
   {
    "l": "C",
    "t": "Create CloudFormation StackSets with approved CloudFormation templates."
   },
   {
    "l": "D",
    "t": "Create AWS Service Catalog products with approved CloudFormation templates."
   }
  ],
  "ans": [
   "D"
  ],
  "multi": 1,
  "expl": [
   "AWS Service Catalog: create products from approved CloudFormation templates so developers can only deploy what has been approved; template constraints enforce rules about tags and resource limits; share the portfolio only in the two permitted Regions; product versioning allows deploying multiple versions."
  ],
  "wrong": [
   {
    "l": "A",
    "t": "Trusted Advisor only gives recommendations and does not enforce policy."
   },
   {
    "l": "B",
    "t": "Drift detection only finds deviations from the deployed template; it does not enforce tags, Regions or template approval."
   },
   {
    "l": "C",
    "t": "StackSets deploys templates to many accounts/Regions; it does not enforce tag/resource policy for developers and does not manage versions like Service Catalog."
   }
  ],
  "remember": "Enforce approved templates + constraints + versions + Regions = Service Catalog.",
  "note": ""
 }
];
