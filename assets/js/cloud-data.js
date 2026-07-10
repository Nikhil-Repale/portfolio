/**
 * DevOps Command Centre — Cloud Data Enhancements
 * Adds: Microsoft Azure (full), enhanced AWS scenarios, enhanced DigitalOcean scenarios.
 * Load this file AFTER tools-extended-additions.js in index.html.
 */
(function () {
  "use strict";

  function waitForData(cb, tries) {
    tries = tries || 0;
    if (window.devopsToolData) return cb();
    if (tries > 60) return;
    setTimeout(function () { waitForData(cb, tries + 1); }, 100);
  }

  waitForData(function () {
    const D = window.devopsToolData;

    /* ================================================================
       MICROSOFT AZURE — Full Playbook
    ================================================================ */
    D.azure = {
      title: "Microsoft Azure",
      subtitle: "Enterprise Cloud Platform & Hybrid Cloud",
      category: "Cloud",
      iconClass: "fab fa-microsoft",
      brandColor: "#0078D4",
      overview: {
        desc: "Azure is Microsoft's enterprise cloud platform covering compute (VMs, AKS), identity (Azure AD/Entra ID), storage (Blob, Files), and networking (VNet, Front Door). It dominates enterprise workloads due to its deep integration with Active Directory, Office 365, and hybrid on-prem connectivity via Azure Arc and ExpressRoute.",
        metrics: [
          { label: "Compute", val: "VMs / AKS / Functions" },
          { label: "Identity", val: "Entra ID (AAD)" },
          { label: "Networking", val: "VNet / Front Door" },
          { label: "Storage", val: "Blob / Files / Disks" },
          { label: "CI/CD", val: "Azure DevOps / Pipelines" },
          { label: "IaC", val: "ARM / Bicep / Terraform" }
        ],
        concepts: [
          { title: "Resource Groups & Subscriptions", desc: "Azure organizes resources into Resource Groups (logical containers) within Subscriptions (billing boundaries). Use Management Groups above subscriptions for enterprise-scale governance.", icon: "fas fa-layer-group" },
          { title: "Azure Entra ID (Active Directory)", desc: "Microsoft's cloud identity platform. Manages users, groups, and service principals. Every Azure resource interaction uses Entra ID for AuthN/AuthZ. RBAC roles are assigned on any resource scope.", icon: "fas fa-id-card" },
          { title: "Virtual Networks (VNet)", desc: "Isolated Layer-3 network in Azure. Subnets divide VNets. Network Security Groups (NSGs) control inbound/outbound at subnet and NIC level. VNet Peering connects VNets privately.", icon: "fas fa-network-wired" },
          { title: "AKS (Azure Kubernetes Service)", desc: "Managed Kubernetes with AAD integration, built-in monitoring via Azure Monitor, and automatic node pool scaling. AKS uses Azure Load Balancer for Services and Application Gateway Ingress Controller (AGIC) for Ingress.", icon: "fas fa-dharmachakra" },
          { title: "Azure DevOps & Pipelines", desc: "End-to-end DevOps platform: Repos (Git), Pipelines (CI/CD), Boards (Agile), Artifacts (package registry). YAML-based pipelines with self-hosted or Microsoft-hosted agents.", icon: "fas fa-code-branch" },
          { title: "Azure Monitor & Log Analytics", desc: "Centralised observability: metrics from all Azure resources stream into Azure Monitor. Log Analytics Workspaces aggregate application and infrastructure logs with KQL query support.", icon: "fas fa-chart-bar" }
        ],
        interviewPrep: [
          {
            q: "What is the difference between a Service Principal and a Managed Identity in Azure?",
            a: "A Service Principal is a manually created app identity with a client secret or certificate that you manage. A Managed Identity is an automatically managed identity created by Azure for a resource (VM, AKS, Function). Managed Identities eliminate the need to store credentials — Azure handles token rotation automatically.",
            tip: "Say: 'In production, I always use Managed Identities over Service Principals to avoid secret leaks.'"
          },
          {
            q: "How does Azure RBAC work and what is the difference between Owner, Contributor, and Reader?",
            a: "Azure RBAC grants access by assigning a Role to a Security Principal (user/group/SP) at a specific Scope (subscription/resource group/resource). Owner = full control + can manage access. Contributor = full control but cannot manage access. Reader = read-only view of resources.",
            tip: "Always follow least privilege: assign Contributor only where deployments happen, never Owner."
          },
          {
            q: "An AKS pod can't connect to an Azure Storage Account. How do you debug this?",
            a: "1. Verify the AKS node pool has the correct Managed Identity with 'Storage Blob Data Reader/Contributor' role on the Storage Account. 2. Check the Storage Account's 'Networking' tab for VNet/subnet allow rules — if 'Selected networks' is active, the AKS subnet must be whitelisted. 3. Test DNS resolution from the pod: 'nslookup mystorageaccount.blob.core.windows.net'. Private Endpoints may need Private DNS Zone records.",
            tip: "Mention Private Endpoints + Private DNS Zones — this is common in enterprise setups."
          }
        ]
      },
      architecture: {
        intro: "A production AKS setup: traffic enters via Azure Front Door (WAF + global CDN), hits the Application Gateway Ingress Controller, routes to AKS pods, connects to Azure SQL / Cosmos DB in a private subnet, all monitored by Azure Monitor.",
        html: `
        <div class="arch-node highlight"><i class="fas fa-globe"></i> <h6>Azure Front Door (WAF)</h6><span>Global Anycast Edge + DDoS Protection</span></div>
        <div class="arch-connector-line vertical"><span class="arch-arrow-label">HTTPS / TLS 1.3</span></div>
        <div class="arch-node core"><i class="fas fa-shield-alt"></i> <h6>Application Gateway (AGIC)</h6><span>L7 Load Balancer + SSL Offload + WAF</span></div>
        <div class="arch-connector-line vertical bidirectional"></div>
        <div class="arch-group">
          <span class="arch-group-title">AKS Cluster (Private, VNet-integrated)</span>
          <div class="arch-node"><i class="fas fa-dharmachakra"></i> <h6>AKS Node Pool 1</h6><span>System Nodes (kube-system)</span></div>
          <div class="arch-node"><i class="fas fa-dharmachakra"></i> <h6>AKS Node Pool 2</h6><span>User Nodes (App Workloads)</span></div>
        </div>
        <div class="arch-connector-line vertical"></div>
        <div class="arch-group">
          <span class="arch-group-title">Data Tier (Private Endpoints)</span>
          <div class="arch-node highlight"><i class="fas fa-database"></i> <h6>Azure SQL / Cosmos DB</h6><span>Private Endpoint (No Public IP)</span></div>
          <div class="arch-node"><i class="fas fa-archive"></i> <h6>Azure Blob Storage</h6><span>Private Endpoint + RBAC Access</span></div>
        </div>
        `,
        details: {
          title: "Azure Enterprise Landing Zone Breakdown",
          components: [
            { name: "Azure Front Door", desc: "Global anycast entry point with WAF, DDoS protection, caching, and instant global failover between Azure regions." },
            { name: "Application Gateway + AGIC", desc: "Layer-7 load balancer running inside the VNet. AGIC controller watches AKS Ingress objects and auto-configures Application Gateway rules." },
            { name: "AKS Private Cluster", desc: "API server has no public IP. Nodes in a VNet subnet communicate via Azure CNI. AAD-integrated RBAC for kubectl access." },
            { name: "Private Endpoints", desc: "Injects Azure PaaS services (SQL, Storage, KeyVault) directly into the VNet with private IPs, eliminating public internet exposure." },
            { name: "Azure Monitor + Log Analytics", desc: "All node, pod, and app logs flow to Log Analytics. KQL queries power dashboards, alerts, and anomaly detection." },
            { name: "Azure Key Vault (CSI Driver)", desc: "Secrets mounted directly into AKS pods as volumes via the Secrets Store CSI Driver — no environment variables, no secret sprawl." }
          ]
        }
      },
      workflow: {
        intro: "Azure DevOps pipeline: from infrastructure provisioning with Bicep/Terraform to AKS deployment with rolling updates and Monitor alerts.",
        steps: [
          { num: 1, title: "Design Network Topology", desc: "Create Hub-Spoke VNet, configure NSGs, set up ExpressRoute or VPN gateway for hybrid connectivity." },
          { num: 2, title: "Set Up Entra ID & RBAC", desc: "Create Managed Identities, assign least-privilege RBAC roles, configure Conditional Access policies." },
          { num: 3, title: "Provision AKS with Terraform/Bicep", desc: "Deploy private AKS cluster with AAD integration, AGIC add-on, and Azure CNI networking." },
          { num: 4, title: "Configure Azure DevOps Pipelines", desc: "Set up multi-stage YAML pipelines with approvals for staging/production environment gates." },
          { num: 5, title: "Deploy Workloads via Helm", desc: "Package Kubernetes manifests as Helm charts, deploy to AKS namespaces with separate values per environment." },
          { num: 6, title: "Configure Azure Monitor Alerts", desc: "Create Log Analytics alerts, dashboards with KQL queries, and action groups to Slack/Teams/PagerDuty." }
        ]
      },
      scenarios: [
        {
          id: "azure_aks_imagepull",
          category: "containers",
          name: "AKS Pod: ImagePullBackOff (Private ACR)",
          cmd: "kubectl describe pod <pod-name> -n <namespace>\naz acr check-health --name myregistry --resource-group my-rg\naz aks check-acr --name myAKSCluster --resource-group my-rg --acr myregistry.azurecr.io",
          explanation: "ImagePullBackOff in AKS against Azure Container Registry (ACR) almost always means the AKS Managed Identity does not have the 'AcrPull' role on the ACR. These commands diagnose the health of the registry connection and ACR integration.",
          output: [
            { type: "prompt", val: "nikhil@ops-center:~$ kubectl describe pod api-deployment-7b8f9 -n production" },
            { type: "error", val: "Failed to pull image 'myregistry.azurecr.io/api:v2.1.0': unauthorized: authentication required" },
            { type: "prompt", val: "nikhil@ops-center:~$ az aks check-acr --name myAKSCluster --resource-group my-rg --acr myregistry.azurecr.io" },
            { type: "error", val: "[2024-01-15T09:23:11Z] Error: The kubelet identity does not have AcrPull permission on ACR 'myregistry'." },
            { type: "warning", val: "⚠ AKS Kubelet Managed Identity is missing 'AcrPull' role on the ACR." },
            { type: "info", val: "Fix: az role assignment create --assignee <kubelet-identity-client-id> --role AcrPull --scope /subscriptions/.../myregistry" }
          ]
        },
        {
          id: "azure_nsg_block",
          category: "network",
          name: "NSG Blocking Traffic — Effective Rules Debug",
          cmd: "az network nsg list --resource-group my-rg --output table\naz network nic show-effective-nsg --name myVMNic --resource-group my-rg\naz network watcher test-connectivity --source-resource <vm-id> --dest-address 10.0.2.10 --dest-port 443",
          explanation: "When VMs or AKS nodes cannot reach each other or a service, Network Security Group rules are the first suspect. Effective NSGs show the merged result of subnet-level and NIC-level rules. Network Watcher's connectivity test simulates a packet path.",
          output: [
            { type: "prompt", val: "nikhil@ops-center:~$ az network nic show-effective-nsg --name myVMNic --resource-group my-rg" },
            { type: "log", val: "Effective Security Rules (Priority Order):\n  100: DENY | Inbound | TCP | Port 443 | Source: VirtualNetwork" },
            { type: "error", val: "✖ Priority 100 DENY rule is blocking HTTPS (port 443) from VirtualNetwork source tag." },
            { type: "prompt", val: "nikhil@ops-center:~$ az network watcher test-connectivity..." },
            { type: "error", val: "Connectivity Check: FAILED | NetworkSecurityGroupBlock at hop 1" },
            { type: "info", val: "Fix: Add inbound allow rule with Priority 90 (higher priority) for TCP 443 from the VirtualNetwork tag." }
          ]
        },
        {
          id: "azure_keyvault_denied",
          category: "security",
          name: "Key Vault Access Denied from AKS Pod",
          cmd: "kubectl logs <pod-name> -n production | grep -i 'keyvault\\|403\\|forbidden'\naz keyvault show --name myKeyVault --query 'properties.networkAcls'\naz role assignment list --assignee <managed-identity-client-id> --scope /subscriptions/.../myKeyVault",
          explanation: "403 Forbidden from Key Vault in AKS pods usually means: the pod's Workload Identity / Managed Identity lacks the 'Key Vault Secrets User' role, OR the Key Vault's network firewall is blocking AKS subnet traffic.",
          output: [
            { type: "prompt", val: "nikhil@ops-center:~$ kubectl logs api-pod-abc123 -n production | grep keyvault" },
            { type: "error", val: "[ERROR] Failed to get secret 'db-password': HttpResponseCode=403, Message=Caller is not authorized" },
            { type: "prompt", val: "nikhil@ops-center:~$ az role assignment list --assignee abc-123 --scope .../myKeyVault" },
            { type: "log", val: "[] (empty — no role assignments found)" },
            { type: "error", val: "✖ Workload Identity has ZERO role assignments on Key Vault 'myKeyVault'." },
            { type: "info", val: "Fix: az role assignment create --assignee <wl-identity-id> --role 'Key Vault Secrets User' --scope /subscriptions/.../myKeyVault" }
          ]
        }
      ],
      commands: [
        { cmd: "az login && az account set --subscription <id>", desc: "Authenticate CLI and set active subscription.", category: "Auth" },
        { cmd: "az group create -n myRG -l eastus", desc: "Create a Resource Group in a specified region.", category: "Resources" },
        { cmd: "az aks get-credentials --resource-group myRG --name myAKS", desc: "Download kubeconfig to connect kubectl to AKS.", category: "AKS" },
        { cmd: "az aks scale --resource-group myRG --name myAKS --node-count 5 --nodepool-name nodepool1", desc: "Scale an AKS node pool to a specific count.", category: "AKS" },
        { cmd: "az acr login --name myregistry", desc: "Authenticate Docker to an Azure Container Registry.", category: "ACR" },
        { cmd: "az keyvault secret show --vault-name myKV --name db-password", desc: "Read a secret from Azure Key Vault.", category: "Security" },
        { cmd: "az monitor log-analytics query -w <workspace-id> --analytics-query 'ContainerLog | top 100'", desc: "Query AKS container logs using KQL.", category: "Monitoring" },
        { cmd: "az network nsg rule create -g myRG --nsg-name myNSG -n AllowHTTPS --priority 100 --source-address-prefixes '*' --destination-port-ranges 443 --access Allow", desc: "Add an NSG inbound rule to allow HTTPS traffic.", category: "Networking" }
      ]
    };

    /* ================================================================
       ENHANCED AWS — Additional Real-World Scenarios
    ================================================================ */
    if (D.aws && D.aws.scenarios) {
      D.aws.scenarios.push(
        {
          id: "aws_rds_failover",
          category: "database",
          name: "RDS Multi-AZ Failover Connectivity Loss",
          cmd: "aws rds describe-db-instances --db-instance-identifier prod-db\naws rds describe-events --source-identifier prod-db --duration 60\nnslookup prod-db.cluster-xyz.us-east-1.rds.amazonaws.com",
          explanation: "During a Multi-AZ failover, the RDS DNS endpoint must flip to the standby. Apps that cache DB connections or IPs (not DNS) break. These commands check the failover status, read recent events, and verify DNS resolution of the RDS cluster endpoint.",
          output: [
            { type: "prompt", val: "nikhil@ops-center:~$ aws rds describe-events --source-identifier prod-db --duration 60" },
            { type: "warning", val: "Event: 'Multi-AZ instance failover started' at 14:23:05 UTC" },
            { type: "log", val: "Event: 'DB instance restarted' at 14:23:47 UTC (42 second RTO)" },
            { type: "prompt", val: "nikhil@ops-center:~$ nslookup prod-db.cluster-xyz.us-east-1.rds.amazonaws.com" },
            { type: "success", val: "✔ DNS now resolves to 10.0.3.45 (new primary in AZ us-east-1b)" },
            { type: "info", val: "Fix: Use the cluster endpoint (not instance endpoint). Ensure app uses DB connection pooling with TCP keepalive, not hardcoded IPs." }
          ]
        },
        {
          id: "aws_ecr_throttle",
          category: "containers",
          name: "ECR Image Pull Throttling in ECS/EKS",
          cmd: "aws ecr get-authorization-token --output text --query 'authorizationData[].authorizationToken'\naws ecr describe-repositories --repository-names my-app\naws cloudwatch get-metric-statistics --namespace AWS/ECR --metric-name RequestThrottled",
          explanation: "ECS tasks or EKS pods failing to pull images from ECR with 'toomanyrequests' errors indicate ECR throttling or stale auth tokens. The ECR token expires every 12 hours — short-lived tasks must refresh tokens.",
          output: [
            { type: "prompt", val: "nikhil@ops-center:~$ kubectl describe pod api-pod | grep -A5 Events" },
            { type: "error", val: "Failed to pull image: toomanyrequests: Rate exceeded" },
            { type: "warning", val: "⚠ ECR is throttling image pulls. Multiple nodes pulling large images simultaneously." },
            { type: "info", val: "Fix 1: Enable ECR pull-through cache or use node-level image caching (e.g. Karpenter node image pre-pull)." },
            { type: "info", val: "Fix 2: Use 'aws ecr get-login-password' in cron job to refresh tokens before 12hr expiry in long-running clusters." }
          ]
        },
        {
          id: "aws_cloudtrail_breach",
          category: "security",
          name: "Suspicious IAM Activity via CloudTrail",
          cmd: "aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=ConsoleLogin\naws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=CreateAccessKey\naws iam list-access-keys --user-name <username>",
          explanation: "CloudTrail is your security camera. Detecting unauthorized ConsoleLogin from unusual IPs or unexpected CreateAccessKey events indicates a potential credential compromise. These commands query CloudTrail for suspicious IAM events.",
          output: [
            { type: "prompt", val: "nikhil@ops-center:~$ aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=CreateAccessKey" },
            { type: "error", val: "Event: CreateAccessKey | User: admin-bot | Source IP: 45.227.255.206 | Time: 2024-01-15T03:14:22Z" },
            { type: "error", val: "✖ ALERT: New access key created at 3:14 AM from an unrecognized IP — possible credential compromise!" },
            { type: "info", val: "Immediate Actions: 1) Disable the key: aws iam update-access-key --status Inactive --access-key-id AKIA..." },
            { type: "info", val: "2) Revoke all active sessions: aws iam delete-login-profile --user-name admin-bot" },
            { type: "info", val: "3) Enable MFA, rotate all keys, audit CloudTrail for last 72 hours." }
          ]
        }
      );

      // Also add AWS commands if not already full
      if (D.aws.commands && D.aws.commands.length < 8) {
        D.aws.commands.push(
          { cmd: "aws logs tail /aws/eks/my-cluster/cluster --follow", desc: "Stream EKS control plane logs in real-time.", category: "EKS" },
          { cmd: "aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=DeleteBucket", desc: "Find who deleted an S3 bucket (audit trail).", category: "Security" },
          { cmd: "aws rds create-db-snapshot --db-instance-identifier prod-db --db-snapshot-identifier prod-snap-$(date +%Y%m%d)", desc: "Create a manual RDS snapshot with timestamp.", category: "RDS" }
        );
      }
    }

    /* ================================================================
       ENHANCED DIGITALOCEAN — More Scenarios & Commands
    ================================================================ */
    if (D.digitalocean) {
      // Add full overview with concepts
      D.digitalocean.overview.concepts = D.digitalocean.overview.concepts || [];
      if (D.digitalocean.overview.concepts.length < 4) {
        D.digitalocean.overview.concepts.push(
          { name: "Spaces (Object Storage)", desc: "S3-compatible object storage with CDN integration for static assets, backups, and media files." },
          { name: "Managed Databases", desc: "Fully managed PostgreSQL, MySQL, Redis, MongoDB with automatic failover and daily backups." },
          { name: "VPC (Virtual Private Cloud)", desc: "Private network isolating Droplets and DOKS nodes from the public internet. Free egress within VPC." },
          { name: "Cloud Firewall", desc: "Stateful firewall rules applied to Droplets or tags. Blocks all ports by default — explicitly open only what's needed." }
        );
      }

      // Add new enhanced scenarios
      D.digitalocean.scenarios = D.digitalocean.scenarios || [];
      D.digitalocean.scenarios.push(
        {
          id: "do_doks_node_notready",
          category: "kubernetes",
          name: "DOKS Node in NotReady State",
          cmd: "kubectl describe node <node-name>\ndoctl kubernetes cluster node-pool list <cluster-id>\ndoctl compute droplet list --tag-name <cluster-tag>",
          explanation: "A NotReady node in DOKS means the node's kubelet has lost contact with the control plane. This is often caused by network issues (VPC routing), node memory/disk pressure, or a Droplet that needs to be recycled.",
          output: [
            { type: "prompt", val: "nikhil@ops-center:~$ kubectl get nodes" },
            { type: "error", val: "worker-pool-gnh3q   NotReady   <none>   2d   v1.28.2" },
            { type: "prompt", val: "nikhil@ops-center:~$ kubectl describe node worker-pool-gnh3q | grep -A5 Conditions" },
            { type: "warning", val: "KubeletNotReady: runtime network not ready: NetworkPlugin kubenet does not have node network" },
            { type: "error", val: "✖ VPC CNI plugin lost its network configuration after a Droplet reboot." },
            { type: "info", val: "Fix: Cordon the node, drain workloads, then delete and replace the Droplet in the DOKS node pool." },
            { type: "info", val: "Command: kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data && doctl kubernetes cluster node-pool replace <cluster-id> <pool-id>" }
          ]
        },
        {
          id: "do_spaces_cors",
          category: "storage",
          name: "Spaces CORS Errors Blocking Browser Uploads",
          cmd: "doctl compute cdn list\ns3cmd info s3://my-space --host=nyc3.digitaloceanspaces.com\ncurl -X OPTIONS https://my-space.nyc3.digitaloceanspaces.com/file.png -H 'Origin: https://myapp.com' -v",
          explanation: "When browser-based uploads to DO Spaces fail with 'CORS policy' errors, the Spaces bucket CORS configuration is missing AllowedOrigin for your app's domain. Unlike S3, DO Spaces CORS is configured via the Spaces API or control panel.",
          output: [
            { type: "prompt", val: "nikhil@ops-center:~$ curl -X OPTIONS https://my-space.nyc3.digitaloceanspaces.com/test.png -H 'Origin: https://myapp.com' -v" },
            { type: "error", val: "< HTTP/1.1 403 Forbidden\n< x-amz-error-code: CORSForbidden" },
            { type: "error", val: "✖ Spaces CORS policy has no rule allowing Origin: https://myapp.com" },
            { type: "info", val: "Fix: In DO Control Panel → Spaces → Settings → CORS, add origin 'https://myapp.com' with methods GET, PUT, POST." },
            { type: "info", val: "Or via s3cmd: edit CORS XML and run 's3cmd setcors cors.xml s3://my-space'" }
          ]
        },
        {
          id: "do_droplet_disk_full",
          category: "system",
          name: "Droplet Root Disk 100% Full — App Crash",
          cmd: "df -h\ndu -sh /* 2>/dev/null | sort -rh | head -10\njournalctl --disk-usage\ndocker system df",
          explanation: "When a DigitalOcean Droplet runs out of disk space, PostgreSQL, Nginx, and Docker all fail silently or crash. Fast triage requires identifying which directory consumed the space.",
          output: [
            { type: "prompt", val: "nikhil@ops-center:~$ df -h" },
            { type: "error", val: "/dev/vda1  50G  50G  0 100% /" },
            { type: "prompt", val: "nikhil@ops-center:~$ du -sh /* 2>/dev/null | sort -rh | head -5" },
            { type: "log", val: "42G  /var\n38G  /var/lib/docker" },
            { type: "warning", val: "⚠ Docker is consuming 38GB — old images, stopped containers, and build cache." },
            { type: "prompt", val: "nikhil@ops-center:~$ docker system prune -a --volumes -f" },
            { type: "success", val: "✔ Reclaimed 35.2GB. Disk usage: 15G / 50G (30%)" }
          ]
        }
      );

      // Add more commands
      D.digitalocean.commands = D.digitalocean.commands || [];
      D.digitalocean.commands.push(
        { id: "do-spaces-sync", cmd: "s3cmd sync ./dist/ s3://my-space/ --host=nyc3.digitaloceanspaces.com --host-bucket='%(bucket)s.nyc3.digitaloceanspaces.com'", desc: "Sync a build directory to DO Spaces.", cat: "Storage" },
        { id: "do-db-list", cmd: "doctl databases list", desc: "List all managed databases (PostgreSQL, MySQL, Redis).", cat: "Database" },
        { id: "do-firewall-create", cmd: "doctl compute firewall create --name prod-firewall --inbound-rules 'protocol:tcp,ports:443,address:0.0.0.0/0'", desc: "Create a cloud firewall allowing HTTPS traffic.", cat: "Security" }
      );
    }

    /* ================================================================
       UPDATE BRAND COLORS & BUTTONS
    ================================================================ */
    if (D.azure) D.azure.brandColor = "#0078D4";

    // Generate dynamic CSS for any new tools added
    const existingStyle = document.getElementById("dynamic-tool-colors-cloud");
    if (!existingStyle) {
      let styleStr = '<style id="dynamic-tool-colors-cloud">';
      const newTools = ["azure"];
      newTools.forEach(function(key) {
        if (D[key] && D[key].brandColor) {
          const hex = D[key].brandColor;
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          styleStr += `
            .selector-btn[data-tool="${key}"].active {
              border-left-color: ${hex} !important;
              background: rgba(${r},${g},${b},0.1) !important;
              color: ${hex} !important;
            }
            .selector-btn[data-tool="${key}"]:hover {
              border-left-color: rgba(${r},${g},${b},0.5) !important;
              background: rgba(${r},${g},${b},0.05) !important;
            }
            .selector-btn[data-tool="${key}"] i { color: ${hex} !important; }
          `;
        }
      });
      styleStr += "</style>";
      document.head.insertAdjacentHTML("beforeend", styleStr);
    }

    console.log("[Cloud Data] Azure, enhanced AWS & DigitalOcean data loaded successfully.");
  });
})();
