document.addEventListener("DOMContentLoaded", () => {
  /* --- ORIGINAL PORTFOLIO LOGIC (PRESERVED) --- */
  const menuButton = document.getElementById("menu");
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".navbar a");
  const scrollTop = document.getElementById("scroll-top");
  const form = document.getElementById("contact-form");
  const successMessage = document.getElementById("success-message");
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle.querySelector("i");
  const themeText = themeToggle.querySelector("span");

  const setTheme = (theme) => {
    const isDark = theme === "dark";

    document.body.classList.toggle("dark-theme", isDark);
    themeIcon.classList.toggle("fa-moon", !isDark);
    themeIcon.classList.toggle("fa-sun", isDark);
    themeText.textContent = isDark ? "White" : "Dark";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to white mode" : "Switch to dark mode");
    localStorage.setItem("portfolioTheme", theme);
  };

  setTheme(localStorage.getItem("portfolioTheme") || "light");

  const closeMenu = () => {
    navbar.classList.remove("nav-toggle");
    menuButton.classList.remove("fa-times");
    menuButton.classList.add("fa-bars");
    menuButton.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("nav-open");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("nav-toggle");
    menuButton.classList.toggle("fa-bars", !isOpen);
    menuButton.classList.toggle("fa-times", isOpen);
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    document.body.classList.toggle("nav-open", isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
    setTheme(nextTheme);
  });

  const updateActiveLink = () => {
    const fromTop = window.scrollY + 120;

    document.querySelectorAll("main section").forEach((section) => {
      const link = document.querySelector(`.navbar a[href="#${section.id}"]`);
      if (!link) return;

      const isActive = section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop;
      link.classList.toggle("active", isActive);
    });

    scrollTop.classList.toggle("active", window.scrollY > 500);
  };

  window.addEventListener("scroll", updateActiveLink);
  updateActiveLink();

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const storedMessages = JSON.parse(localStorage.getItem("portfolioMessages") || "[]");
      storedMessages.push({
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
        createdAt: new Date().toISOString()
      });

      localStorage.setItem("portfolioMessages", JSON.stringify(storedMessages));
      successMessage.textContent = "Thanks! Your message is saved locally. Please email me directly for the fastest reply.";
      form.reset();
    });
    const devopsToolData = {
      aws: {
        title: "Amazon Web Services",
        subtitle: "Cloud Infrastructure & Scalable Services",
        category: "Infrastructure",
        iconClass: "fab fa-aws",
        overview: {
          desc: "AWS is basically a massive global server rental. Instead of buying physical hardware, you spin up VMs, databases, and networks on-demand and pay by the hour. For DevOps, the core is networking (VPC), security (IAM), compute (EC2), storage (S3), and monitoring (CloudWatch).",
          metrics: [
            { label: "Design Principle", val: "Well-Architected" },
            { label: "Target Availability", val: "99.99% SLA" },
            { label: "Key Database", val: "RDS Multi-AZ" },
            { label: "Security Model", val: "Least Privilege" },
            { label: "Global Edge", val: "CloudFront CDN" },
            { label: "Compute Engine", val: "EC2 / ECS / Lambda" }
          ],
          concepts: [
            { title: "Virtual Private Cloud (VPC)", desc: "Your private network bubble in AWS. You control access using subnets, route tables, and gateways.", icon: "fas fa-network-wired" },
            { title: "IAM (Identity & Access)", desc: "The bouncer of your cloud. Controls who gets access to what. Always follow 'least privilege' and use roles instead of access keys.", icon: "fas fa-shield-alt" },
            { title: "EC2 (Elastic Compute)", desc: "Virtual servers. Rent them on-demand, commit long-term (Reserved) to save cash, or bid cheap (Spot) for non-critical jobs.", icon: "fas fa-server" },
            { title: "S3 (Simple Storage)", desc: "Unlimited file storage. Perfect for asset hosting, static sites, and cheap backups using Glacier archives.", icon: "fas fa-hdd" },
            { title: "RDS (Managed DB)", desc: "Managed SQL databases. AWS handles the boring stuff: patching, backups, replication, and multi-zone failovers.", icon: "fas fa-database" },
            { title: "Load Balancing & Scaling", desc: "ALB distributes incoming traffic so no server gets overwhelmed. Auto-scaling adds/removes instances to save money.", icon: "fas fa-balance-scale" },
            { title: "CloudWatch & Trail", desc: "CloudWatch monitors metrics and logs; CloudTrail acts as a security camera, recording every API call made in your account.", icon: "fas fa-eye" },
            { title: "Route 53", desc: "AWS's smart DNS service. Translates domain names, monitors endpoint health, and routes users to the nearest healthy server.", icon: "fas fa-globe" }
          ],
          interviewPrep: [
            {
              q: "What is the difference between a Security Group and a Network ACL (NACL)?",
              a: "Security Groups are stateful firewalls at the instance level (if you allow traffic in, it's allowed out automatically). NACLs are stateless at the subnet level (you must explicitly write rules for both incoming and outgoing traffic).",
              tip: "Stateful vs stateless is the keyword to drop here."
            },
            {
              q: "How does a private subnet EC2 instance connect to the internet?",
              a: "Route outbound traffic through a NAT Gateway placed in a public subnet. It lets the private instance download updates but blocks direct incoming connections from the internet.",
              tip: "NAT Gateway is managed and autoscales; NAT Instance is self-managed and cheaper."
            },
            {
              q: "Explain IAM Users, Groups, and Roles — when do you use each?",
              a: "Users are long-term accounts for people/apps. Groups bundle permissions for teams. Roles provide temporary access tokens (via STS) for services like EC2 to run securely without hardcoded credentials.",
              tip: "Always say: 'I never hardcode API keys; I assign IAM Roles.'"
            }
          ]
        },
        architecture: {
          intro: "A standard Multi-AZ setup: traffic flows through Route 53 and CloudFront, hits the ALB in public subnets, routes to private EC2 app nodes, and connects to RDS in the data tier.",
          html: `
          <div class="arch-node highlight"><i class="fas fa-globe"></i> <h6>Route 53 DNS</h6><span>Domain Resolution & Health Routing</span></div>
          <div class="arch-connector-line vertical"><span class="arch-arrow-label">DNS Resolution</span></div>
          <div class="arch-node"><i class="fas fa-cloud"></i> <h6>CloudFront CDN</h6><span>Edge Cache & SSL Termination</span></div>
          <div class="arch-connector-line vertical"></div>
          <div class="arch-node core"><i class="fas fa-shield-alt"></i> <h6>Application Load Balancer</h6><span>Public Subnets (Multi-AZ)</span></div>
          <div class="arch-connector-line vertical bidirectional"><span class="arch-arrow-label">HTTPS SSL Offload</span></div>
          <div class="arch-group">
            <span class="arch-group-title">Private Subnet App Tier (Secure Compute)</span>
            <div class="arch-node"><i class="fas fa-server"></i> <h6>EC2 Instance A</h6><span>AZ-1 (Auto Scaling Group)</span></div>
            <div class="arch-node"><i class="fas fa-server"></i> <h6>EC2 Instance B</h6><span>AZ-2 (Auto Scaling Group)</span></div>
          </div>
          <div class="arch-connector-line vertical"></div>
          <div class="arch-group">
            <span class="arch-group-title">Isolated DB Subnet (Data Tier)</span>
            <div class="arch-node highlight"><i class="fas fa-database"></i> <h6>RDS Primary</h6><span>AZ-1 (PostgreSQL)</span></div>
            <div class="arch-node highlight"><i class="fas fa-database"></i> <h6>RDS Standby</h6><span>AZ-2 (Multi-AZ Replica)</span></div>
          </div>
        `,
          details: {
            title: "3-Tier Secure Cloud Architecture Breakdown",
            components: [
              { name: "Route 53 DNS", desc: "Resolves domain names, monitors health, and routes users to healthy resources." },
              { name: "CloudFront CDN", desc: "Caches static assets globally to reduce latency and offload traffic." },
              { name: "Application Load Balancer", desc: "Lives in public subnets; distributes traffic evenly across backend EC2 instances." },
              { name: "Auto Scaling Group", desc: "Launches new instances during traffic spikes and stops them when idle." },
              { name: "Private Subnet EC2 Nodes", desc: "App servers with no public IP, reachable only through the load balancer." },
              { name: "RDS Multi-AZ Database", desc: "Primary database with instant failover to a standby copy in another zone." }
            ]
          }
        },
        workflow: {
          intro: "AWS workflow: from configuring the network to deploying rolling updates and monitoring logs.",
          steps: [
            { num: 1, title: "Design VPC Network", desc: "Map CIDR blocks, create public/private subnets, and configure routes." },
            { num: 2, title: "Set Up IAM & Security", desc: "Configure least-privilege security groups, roles, and API logs." },
            { num: 3, title: "Provision Compute & DB", desc: "Launch auto-scaling EC2 instances and set up Multi-AZ RDS databases." },
            { num: 4, title: "Configure Load Balancer", desc: "Set up target groups, health checks, and SSL certificates." },
            { num: 5, title: "Deploy Application", desc: "Push container images to ECR and run rolling updates." },
            { num: 6, title: "Monitor & Alert", desc: "Configure CloudWatch dashboards and Slack alerts for metrics." }
          ]
        },
        scenarios: [
          {
            id: "aws_ec2_timeout",
            category: "security",
            name: "EC2 SSH Connection Timeout",
            cmd: "aws ec2 describe-route-tables --filters \"Name=association.subnet-id,Values=subnet-1234\"\naws ec2 describe-security-groups --group-ids sg-5678\nnc -zv -w 5 54.210.15.82 22",
            explanation: "SSH timeouts indicate firewalls or routing blocks. These commands check the subnet's route table, check security groups for port 22 access, and run a port probe.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ aws ec2 describe-security-groups --group-ids sg-5678" },
              { type: "log", val: "[\n  { \"FromPort\": 80, \"ToPort\": 80, \"IpProtocol\": \"tcp\", \"IpRanges\": [ { \"CidrIp\": \"0.0.0.0/0\" } ] }\n]" },
              { type: "error", val: "✖ Port 22 (SSH) is NOT allowed in this Security Group. Only port 80 exists." },
              { type: "info", val: "Fix: Add an ingress rule allowing port 22 from your specific IP." }
            ]
          },
          {
            id: "aws_alb_502",
            category: "network",
            name: "ALB Returning 502 Bad Gateway",
            cmd: "aws elbv2 describe-target-health --target-group-arn arn:aws:elasticloadbalancing:...\nssh ubuntu@10.0.2.15 'sudo systemctl status node-app'",
            explanation: "502 Bad Gateway means the load balancer couldn't connect to the backend instances because they are offline, crashed, or misconfigured.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ aws elbv2 describe-target-health..." },
              { type: "log", val: "Target: State = unhealthy, Reason = Connection refused" },
              { type: "error", val: "✖ Target instance is UNHEALTHY — Connection Refused." },
              { type: "info", val: "Fix: Restart the app service on the EC2 server: 'sudo systemctl restart node-app'." }
            ]
          },
          {
            id: "aws_s3_policy",
            category: "security",
            name: "S3 Bucket Policy Access Denied",
            cmd: "aws s3 ls s3://company-prod-logs\naws s3api get-bucket-policy --bucket company-prod-logs",
            explanation: "Access Denied on S3 indicates IAM blocks or Bucket Policy restrictions. These commands test bucket listing and fetch the explicit bucket policy to diagnose blocks.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ aws s3 ls s3://company-prod-logs" },
              { type: "error", val: "An error occurred (AccessDenied) when calling the ListObjectsV2 operation: Access Denied" },
              { type: "prompt", val: "nikhil@ops-center:~$ aws s3api get-bucket-policy --bucket company-prod-logs" },
              { type: "log", val: "{\n  \"Statement\": [\n    { \"Effect\": \"Deny\", \"Principal\": \"*\", \"Action\": \"s3:*\", \"Resource\": \"arn:aws:s3:::company-prod-logs/*\",\n      \"Condition\": { \"NotIpAddress\": { \"aws:SourceIp\": \"203.0.113.50\" } } }\n  ]\n}" },
              { type: "warning", val: "⚠ BUCKET POLICY EXPLICIT DENY: All IPs except 203.0.113.50 are blocked from reading S3 assets." },
              { type: "info", val: "Fix: Update the bucket policy to whitelist your runner/office IP CIDR." }
            ]
          }
        ],
        commands: [
          { cmd: "aws configure", desc: "Set up your AWS CLI credentials and region.", category: "Setup" },
          { cmd: "aws sts get-caller-identity", desc: "Show your active AWS account and IAM identity.", category: "IAM" },
          { cmd: "aws ec2 describe-instances", desc: "List all active EC2 instances and their IP details.", category: "EC2" },
          { cmd: "aws s3 sync ./local s3://my-bucket", desc: "Sync a local folder to an S3 bucket.", category: "S3" },
          { cmd: "aws elbv2 describe-target-health", desc: "Check target health behind a load balancer.", category: "Networking" }
        ]
      },
      docker: {
        title: "Docker Containers",
        subtitle: "Workload Isolation & Packaging",
        category: "Containers",
        iconClass: "fab fa-docker",
        overview: {
          desc: "Docker solves the 'works on my machine' problem. It packages your app, runtime, and libraries into a portable container. Unlike virtual machines, containers share the host kernel, making them lightweight, fast, and resource-efficient.",
          metrics: [
            { label: "Packaging Unit", val: "Immutable Image" },
            { label: "Host Sharing", val: "Shared Kernel" },
            { label: "Size Optimization", val: "Multi-Stage Build" },
            { label: "Volume Types", val: "Named & Bind" },
            { label: "Networking", val: "Bridge / Host / None" },
            { label: "Orchestration", val: "Compose / Swarm / K8s" }
          ],
          concepts: [
            { title: "Docker Image vs Container", desc: "Images are read-only blueprints (recipes). Containers are running, isolated instances of those blueprints (dishes).", icon: "fas fa-layer-group" },
            { title: "Dockerfile & Cache Layers", desc: "A text file of instructions to build your image. Each command adds a layer. Order them least-changing to most-changing to speed up cache builds.", icon: "fas fa-file-code" },
            { title: "Multi-Stage Builds", desc: "Use one stage to compile code, then copy only the final binary to a tiny runtime image (e.g. Alpine), shrinking sizes from 1GB to 50MB.", icon: "fas fa-compress-arrows-alt" },
            { title: "Docker Networking", desc: "Bridge network lets containers on the host talk to each other. Host mode removes isolation for raw performance. Overlay runs across nodes.", icon: "fas fa-project-diagram" },
            { title: "Volumes & Bind Mounts", desc: "Volumes persist container data (like DB files) on the host disk. Bind mounts link local folders to container paths, ideal for live development.", icon: "fas fa-database" },
            { title: "Docker Compose", desc: "A YAML file to define and run multi-container applications (app, database, cache) with a single command.", icon: "fas fa-boxes" }
          ],
          interviewPrep: [
            {
              q: "What is the difference between CMD and ENTRYPOINT in a Dockerfile?",
              a: "ENTRYPOINT sets the command that always runs when the container starts. CMD sets the default arguments which can be easily overridden during 'docker run'.",
              tip: "Always use the JSON array form (exec form) to ensure OS signals pass directly to your app."
            },
            {
              q: "How do you reduce Docker image size?",
              a: "Use multi-stage builds, switch to minimal base images like Alpine or Distroless, and run cleanup commands (like removing cache) in the same RUN layer.",
              tip: "Mention real metrics: 'I got our API image down from 900MB to 50MB using these.'"
            },
            {
              q: "What are Docker volumes and why do we need them?",
              a: "Containers have ephemeral filesystems. When a container restarts or is deleted, its internal files are lost. Volumes map container paths to host storage to persist data.",
              tip: "Databases in Docker should always write to named volumes."
            }
          ]
        },
        architecture: {
          intro: "The Docker engine runs on the host OS. Containers run in isolated namespaces on a bridge network, mounting volumes for persistent data.",
          html: `
          <div class="arch-node core"><i class="fab fa-docker"></i> <h6>Docker Daemon (Engine)</h6><span>Background Service Managing Everything</span></div>
          <div class="arch-connector-line vertical"></div>
          <div class="arch-group">
            <span class="arch-group-title">Custom Bridge Network (App Network)</span>
            <div class="arch-node"><i class="fas fa-server"></i> <h6>Nginx Reverse Proxy</h6><span>Port 80 → 8080 (Frontend)</span></div>
            <div class="arch-node"><i class="fas fa-code"></i> <h6>Node.js App</h6><span>Port 8080 (Backend API)</span></div>
            <div class="arch-node highlight"><i class="fas fa-database"></i> <h6>PostgreSQL DB</h6><span>Port 5432 (Data Store)</span></div>
          </div>
        `,
          details: {
            title: "Docker Host Runtime Architecture",
            components: [
              { name: "Docker Daemon", desc: "The background engine that builds, runs, and manages container workloads." },
              { name: "Bridge Network", desc: "Virtual internal switch allowing containers to communicate using container names as DNS hosts." },
              { name: "Namespaces & Cgroups", desc: "Linux features that isolate processes (Namespaces) and limit resources like CPU/RAM (Cgroups)." },
              { name: "Named Volumes", desc: "Managed host storage folders mapped into containers to keep data safe across container lifecycles." }
            ]
          }
        },
        workflow: {
          intro: "Docker lifecycle: write a Dockerfile, build the image, run local validation, and push to a registry.",
          steps: [
            { num: 1, title: "Write Dockerfile", desc: "Create a multi-stage Dockerfile with a minimal base image." },
            { num: 2, title: "Build Image", desc: "Run 'docker build' to compile dependencies and code into cached layers." },
            { num: 3, title: "Test Locally", desc: "Spin up your database, cache, and app using 'docker compose up'." },
            { num: 4, title: "Scan for Vulnerabilities", desc: "Scan the output image for CVE security issues using Trivy." },
            { num: 5, title: "Push to Registry", desc: "Tag the image and push to your container registry (DockerHub/ECR)." },
            { num: 6, title: "Deploy in Production", desc: "Pull the image and run it with CPU/RAM resource limits enabled." }
          ]
        },
        scenarios: [
          {
            id: "docker_oom_exit",
            category: "system",
            name: "Container Exits Immediately (OOM Kill)",
            cmd: "docker ps -a --filter status=exited\ndocker logs --tail 30 web-app-container\ndocker inspect web-app-container --format '{{json .State}}'",
            explanation: "If a container crashes instantly, it's often due to code errors or memory limit exhaustion (OOM). These commands check the container state, inspect exit codes, and print logs.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ docker ps -a" },
              { type: "log", val: "Exited (137) 4 minutes ago" },
              { type: "warning", val: "Exit code 137 indicates the container was terminated by the OOM killer." },
              { type: "info", val: "Fix: Increase container memory limits with '-m 512m'." }
            ]
          },
          {
            id: "docker_disk_space",
            category: "storage",
            name: "Docker Eating All Disk Space",
            cmd: "docker system df\ndocker builder prune -f\ndocker system prune -a --volumes -f",
            explanation: "Docker caches build layers, stopped containers, and unused volumes. Running these commands audits disk usage and prunes old build caches and dangling images.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ docker system df" },
              { type: "log", val: "Images: 18.42GB (87% Reclaimable), Cache: 8.10GB" },
              { type: "success", val: "✔ Reclaimed 28.72GB of disk space by running system prune." }
            ]
          },
          {
            id: "docker_network_dns",
            category: "network",
            name: "Container DNS Resolution Failure",
            cmd: "docker exec -it web-app ping -c 2 google.com\ndocker exec -it web-app cat /etc/resolv.conf",
            explanation: "If a container fails to reach external web interfaces or databases, it indicates container DNS configs are broken or blocked by the host.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ docker exec -it web-app ping -c 2 google.com" },
              { type: "error", val: "ping: bad address 'google.com'" },
              { type: "prompt", val: "nikhil@ops-center:~$ docker exec -it web-app cat /etc/resolv.conf" },
              { type: "log", val: "nameserver 192.168.12.5" },
              { type: "error", val: "✖ Nameserver 192.168.12.5 is unresponsive — invalid gateway resolved." },
              { type: "info", val: "Fix: Force docker to run with Google DNS: '--dns=8.8.8.8' or configure host DNS forwarding." }
            ]
          }
        ],
        commands: [
          { cmd: "docker build -t myapp:v1 .", desc: "Build an image from the local Dockerfile.", category: "Images" },
          { cmd: "docker run -d -p 80:80 nginx", desc: "Run a container in the background (detached), forwarding ports.", category: "Containers" },
          { cmd: "docker ps -a", desc: "List all running and stopped containers.", category: "Containers" },
          { cmd: "docker exec -it web sh", desc: "Open an interactive terminal inside a running container.", category: "Containers" },
          { cmd: "docker logs -f web", desc: "Stream standard output logs from a container.", category: "Containers" },
          { cmd: "docker system prune -a --volumes", desc: "Wipe all stopped containers, networks, and unused images.", category: "System" }
        ]
      },
      kubernetes: {
        title: "Kubernetes (K8s)",
        subtitle: "Container Orchestration & Self-Healing",
        category: "Orchestration",
        iconClass: "fas fa-dharmachakra",
        overview: {
          desc: "Kubernetes orchestrates container fleets across server clusters. It automates container placement (scheduling), scales pod replicas on demand, self-heals crashed containers, and handles rolling updates with zero downtime.",
          metrics: [
            { label: "Smallest Unit", val: "Pod" },
            { label: "Scaling", val: "HPA (Autoscaler)" },
            { label: "Config Method", val: "Declarative YAML" },
            { label: "DNS Service", val: "CoreDNS" },
            { label: "State Store", val: "etcd Datastore" },
            { label: "Package Manager", val: "Helm Charts" }
          ],
          concepts: [
            { title: "Pods — Smallest Unit", desc: "A Pod wraps one or more containers sharing network namespaces and storage. Usually one container per pod, plus occasional sidecars.", icon: "fas fa-cube" },
            { title: "Deployments", desc: "Controls stateful configurations, manages replication, performs zero-downtime rollouts, and executes rollbacks.", icon: "fas fa-layer-group" },
            { title: "Services", desc: "Stable IP/DNS endpoint that routes incoming requests across dynamic, ephemeral pod replicas.", icon: "fas fa-route" },
            { title: "Ingress", desc: "L7 traffic routing cop. Translates external HTTP/HTTPS domains into internal services.", icon: "fas fa-network-wired" },
            { title: "ConfigMaps & Secrets", desc: "Decouples configuration from image code. ConfigMaps hold settings; Secrets store credentials (base64).", icon: "fas fa-key" },
            { title: "Probes (Health Checks)", desc: "Liveness probe restarts locked apps; Readiness probe stops routing traffic to booting apps; Startup delays checks.", icon: "fas fa-heartbeat" }
          ],
          interviewPrep: [
            {
              q: "What is a Pod and why doesn't K8s just run containers directly?",
              a: "A Pod is the smallest deployable unit wrapping one or more containers. Containers inside a Pod share the same network IP, ports, and storage volumes, allowing them to talk via localhost (Sidecar pattern).",
              tip: "Mention the 'Sidecar Pattern' for logging (Fluent Bit) or proxies (Envoy)."
            },
            {
              q: "What's the difference between Liveness, Readiness, and Startup Probes?",
              a: "Liveness checks if the app is deadlocked and restarts it. Readiness checks if the app is ready for traffic (removes it from service if failing). Startup disables other probes until boot completes.",
              tip: "Remember: 'Liveness triggers RESTART, Readiness stops TRAFFIC.'"
            },
            {
              q: "What is the difference between a Deployment, StatefulSet, and DaemonSet?",
              a: "Deployments manage interchangeable stateless pods. StatefulSets manage database pods with sticky network IDs and persistent storage. DaemonSets run exactly one pod on every node (e.g. monitoring agents).",
              tip: "Stateless = Deployment; Databases = StatefulSet; Node Agents = DaemonSet."
            }
          ]
        },
        architecture: {
          intro: "An Ingress Controller accepts traffic, routing it via ClusterIP Services to Pod replicas running on worker nodes. The Control Plane schedules and manages health.",
          html: `
          <div class="arch-node highlight"><i class="fas fa-globe"></i> <h6>External Traffic</h6><span>Users / API Clients</span></div>
          <div class="arch-connector-line vertical"></div>
          <div class="arch-node highlight"><i class="fas fa-network-wired"></i> <h6>NGINX Ingress Controller</h6><span>L7 HTTP Routing & SSL</span></div>
          <div class="arch-connector-line vertical"></div>
          <div class="arch-node core"><i class="fas fa-dharmachakra"></i> <h6>ClusterIP Service</h6><span>Stable Internal Endpoint</span></div>
          <div class="arch-connector-line vertical bidirectional"><span class="arch-arrow-label">Label Selector Match</span></div>
          <div class="arch-group">
            <span class="arch-group-title">Worker Nodes (EC2 Instances)</span>
            <div class="arch-node"><i class="fas fa-cube"></i> <h6>Pod Replica 1</h6><span>Node 1 (App + Sidecar)</span></div>
            <div class="arch-node"><i class="fas fa-cube"></i> <h6>Pod Replica 2</h6><span>Node 2 (App + Sidecar)</span></div>
          </div>
          <div class="arch-connector-line vertical"></div>
          <div class="arch-group">
            <span class="arch-group-title">Storage Layer</span>
            <div class="arch-node"><i class="fas fa-database"></i> <h6>PersistentVolumeClaim</h6><span>Dynamic EBS Provisioning</span></div>
            <div class="arch-node"><i class="fas fa-key"></i> <h6>Secrets & ConfigMaps</h6><span>Mounted as Volumes/Env Vars</span></div>
          </div>
        `,
          details: {
            title: "Kubernetes Cluster Architecture Breakdown",
            components: [
              { name: "Ingress Controller", desc: "Translates external HTTP rules into internal service routing and terminates SSL." },
              { name: "ClusterIP Service", desc: "Exposes a stable cluster-internal IP that maps traffic to matching pod labels." },
              { name: "Worker Nodes & Kubelet", desc: "Nodes run the containers. Kubelet is the node agent checking pod specs." },
              { name: "PVC / PV", desc: "Claims and provisions block storage (e.g. AWS EBS) that survives pod restarts." }
            ]
          }
        },
        workflow: {
          intro: "K8s lifecycle: write YAML specifications, package into templates via Helm, apply, and monitor.",
          steps: [
            { num: 1, title: "Write YAML Manifests", desc: "Define Deployments, Services, ConfigMaps, and Ingress rules." },
            { num: 2, title: "Lint & Validate", desc: "Verify manifests using tools like kube-linter to ensure security settings." },
            { num: 3, title: "Package with Helm", desc: "Template YAMLs into reusable Helm charts with separate env values files." },
            { num: 4, title: "Apply to Cluster", desc: "Run 'helm upgrade' or 'kubectl apply' to push definitions to etcd." },
            { num: 5, title: "Verify Rollout", desc: "Monitor rollout status to check that pods boot and probes pass." },
            { num: 6, title: "Monitor & Alert", desc: "Scrape metrics via Prometheus and trace logs using Grafana panels." }
          ]
        },
        scenarios: [
          {
            id: "k8s_crashloop",
            category: "system",
            name: "Pod Stuck in CrashLoopBackOff",
            cmd: "kubectl get pods -n production\nkubectl describe pod web-deploy-xyz -n production\nkubectl logs web-deploy-xyz --previous -n production",
            explanation: "CrashLoopBackOff means the pod starts and immediately crashes in a loop. Running these commands inspects pod events and reads the previous container log to diagnose database timeouts or missing config.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ kubectl logs web-deploy-xyz --previous" },
              { type: "log", val: "Error: Connection string to database could not be resolved." },
              { type: "error", val: "✖ App fails to connect to the database — DNS resolution error." },
              { type: "info", val: "Fix: Check if the database service is up and verifying ConfigMap settings." }
            ]
          },
          {
            id: "k8s_pending",
            category: "system",
            name: "Pod Stuck in Pending State",
            cmd: "kubectl describe pod pending-pod-123\nkubectl top nodes",
            explanation: "Pending means K8s cannot place the pod on any worker node. This command inspects scheduler events to check for resource limits (OOM/CPU) or taints.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ kubectl describe pod pending-pod-123" },
              { type: "log", val: "Warning  FailedScheduling  0/3 nodes available: 3 Insufficient memory." },
              { type: "error", val: "✖ Worker nodes are out of memory — cannot host the pod." },
              { type: "info", val: "Fix: Scale up the cluster node count or reduce pod resource requests." }
            ]
          },
          {
            id: "k8s_pv_mount_fail",
            category: "storage",
            name: "Volume Mount Fail (Timeout Block)",
            cmd: "kubectl get pvc\nkubectl describe pod db-server-0 | grep -i mount -A 5",
            explanation: "Volume mounts fail when storage providers are slow to unbind disks from previous crashed nodes or when block device drivers lock volumes.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ kubectl get pvc" },
              { type: "log", val: "NAME      STATUS   VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS\ndb-claim  Bound    pv-001   10Gi       RWO            gp2" },
              { type: "prompt", val: "nikhil@ops-center:~$ kubectl describe pod db-server-0" },
              { type: "log", val: "Warning  FailedMount  VolumeMounts: MountVolume.SetUp failed for volume \"pv-001\" : device /dev/xvdf is locked by another task." },
              { type: "error", val: "✖ Device /dev/xvdf is LOCKED by an orphaned task on Node-3." },
              { type: "info", val: "Fix: SSH to Node-3 and clear stale processes, or manually detach EBS in AWS console." }
            ]
          }
        ],
        commands: [
          { cmd: "kubectl get pods -n production", desc: "List all running pods in a specific namespace.", category: "View" },
          { cmd: "kubectl describe pod mypod", desc: "Show detailed event logs and specs for a specific pod.", category: "Debug" },
          { cmd: "kubectl logs -f mypod", desc: "Stream logs from a container inside a pod.", category: "Debug" },
          { cmd: "kubectl apply -f deployment.yaml", desc: "Create or update cluster resources from a file.", category: "Deploy" },
          { cmd: "helm install myapp ./chart", desc: "Deploy a Helm package to the cluster.", category: "Helm" }
        ]
      },
      jenkins: {
        title: "Jenkins CI/CD",
        subtitle: "Pipeline Automation & Execution",
        category: "CI/CD",
        iconClass: "fas fa-cogs",
        overview: {
          desc: "Jenkins is the automation engine that binds your code changes to production. It watches Git, triggers builds on code commits, runs automated tests, scans for bugs, and pushes the final package to the cloud.",
          metrics: [
            { label: "Pipeline Language", val: "Declarative Groovy" },
            { label: "Orchestrator", val: "Controller (Master)" },
            { label: "Executors", val: "Distributed Agents" },
            { label: "Security", val: "Credential Binding" },
            { label: "Code Reusability", val: "Shared Libraries" },
            { label: "Notifications", val: "Post-Build Blocks" }
          ],
          concepts: [
            { title: "Declarative Pipeline", desc: "Modern standard. Structured pipeline-as-code scripts that live in Git, ensuring version-controlled build steps.", icon: "fas fa-file-code" },
            { title: "Controller & Agent", desc: "The Controller (master) coordinates and manages settings, while lightweight Agents (workers) execute the actual builds.", icon: "fas fa-sitemap" },
            { title: "Ephemeral Containers", desc: "Spinning up fresh Docker containers as build agents on-demand, which are destroyed immediately after build completion.", icon: "fas fa-cubes" },
            { title: "Secret Masking", desc: "Storing keys and credentials centrally in Jenkins and injecting them safely; Jenkins automatically masks them in logs.", icon: "fas fa-key" },
            { title: "Shared Libraries", desc: "Reusable Groovy scripts stored in Git, allowing multiple projects to reuse the same CI/CD helpers without duplication.", icon: "fas fa-share-alt" },
            { title: "Post Actions", desc: "The 'post' block runs after pipeline completion to handle Slack notifications, clean workspaces, or trigger rollbacks.", icon: "fas fa-bell" }
          ],
          interviewPrep: [
            {
              q: "What is the difference between Scripted and Declarative Pipelines?",
              a: "Scripted pipelines are written in raw Groovy (flexible but complex). Declarative pipelines use a strict, structured syntax (cleaner, safer, and recommended for most pipelines).",
              tip: "Say: 'We use Declarative for readability and consistency across our team.'"
            },
            {
              q: "Why should you NEVER build jobs on the Jenkins Master?",
              a: "Running builds on the master node compromises security (scripts get root server access) and degrades UI performance if CPU usage spikes.",
              tip: "Master manages; Agents build. Always use ephemeral Docker agents."
            },
            {
              q: "How do Jenkins webhooks work?",
              a: "Instead of polling Git every minute, your Git host (GitHub/GitLab) sends an instant HTTP POST to Jenkins on new commits, triggering the build immediately.",
              tip: "Webhooks save resources and run CI in real-time."
            }
          ]
        },
        architecture: {
          intro: "Jenkins Controller acts as the brain managing schedules, while ephemeral Docker nodes check out code, run tests, and push build artifacts to ECR.",
          html: `
          <div class="arch-node core"><i class="fas fa-cogs"></i> <h6>Jenkins Controller (Master)</h6><span>Pipeline Orchestrator & UI</span></div>
          <div class="arch-connector-line vertical bidirectional"><span class="arch-arrow-label">Agent Scheduling</span></div>
          <div class="arch-group">
            <span class="arch-group-title">Ephemeral Build Agents</span>
            <div class="arch-node"><i class="fab fa-docker"></i> <h6>Docker Agent (Node.js)</h6><span>Build & Test Executor</span></div>
            <div class="arch-node"><i class="fab fa-docker"></i> <h6>Docker Agent (Maven)</h6><span>Java Build Executor</span></div>
          </div>
          <div class="arch-connector-line vertical"></div>
          <div class="arch-group">
            <span class="arch-group-title">Artifact & Image Storage</span>
            <div class="arch-node highlight"><i class="fas fa-archive"></i> <h6>AWS ECR Registry</h6><span>Docker Image Repository</span></div>
            <div class="arch-node highlight"><i class="fas fa-box"></i> <h6>Nexus / Artifactory</h6><span>Build Artifact Storage</span></div>
          </div>
        `,
          details: {
            title: "Jenkins Distributed Build Architecture",
            components: [
              { name: "Jenkins Controller", desc: "Manages the build queue, configurations, and handles job scheduling." },
              { name: "Docker Build Agents", desc: "Isolated Docker containers spawned on-demand to run build tasks, then destroyed." },
              { name: "Credentials Store", desc: "Encrypts credentials, injecting them dynamically during pipeline runtimes." },
              { name: "ECR & Artifact Registry", desc: "Stores output Docker images and binary assets generated during successful builds." }
            ]
          }
        },
        workflow: {
          intro: "A typical Jenkins pipeline: developer pushes code, webhooks trigger a build, tests run, and the app deploys.",
          steps: [
            { num: 1, title: "Git Push Trigger", desc: "Webhook detects code change and notifies Jenkins to trigger pipeline." },
            { num: 2, title: "Checkout & Install", desc: "Jenkins fetches source code and installs development dependencies." },
            { num: 3, title: "Build & Unit Test", desc: "Compile code and execute tests. Halt pipeline on failures." },
            { num: 4, title: "Security Scan", desc: "Scan code via SonarQube and search for container CVEs using Trivy." },
            { num: 5, title: "Docker Build", desc: "Build output image, tagging it with the Git SHA, and push to AWS ECR." },
            { num: 6, title: "Deploy to Cloud", desc: "Trigger rolling updates to ECS/EKS and send status alerts to Slack." }
          ]
        },
        scenarios: [
          {
            id: "jenkins_no_executor",
            category: "system",
            name: "Pipeline Stuck — No Matching Agent",
            cmd: "curl -s -u admin:token http://jenkins:8080/computer/api/json\ncurl -s -u admin:token http://jenkins:8080/queue/api/json",
            explanation: "When a pipeline requests a label that doesn't exist or matches an offline agent, the build remains queued. These API calls trace active agent labels.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ curl -s http://jenkins:8080/queue/api/json" },
              { type: "log", val: "\"why\": \"Waiting for next available executor with label docker-builder\"" },
              { type: "error", val: "✖ No online agent matches the required label." },
              { type: "info", val: "Fix: Check agent configuration and bring the builder node online." }
            ]
          },
          {
            id: "jenkins_docker_fail",
            category: "security",
            name: "Docker Permission Denied in Agent",
            cmd: "ssh jenkins@agent-ip 'groups jenkins && docker ps'\nssh jenkins@agent-ip 'ls -lh /var/run/docker.sock'",
            explanation: "If the Jenkins builder process cannot interact with Docker on the agent machine, it fails with Permission Denied. The agent user must join the 'docker' system group.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ ssh jenkins@agent-ip 'groups jenkins'" },
              { type: "log", val: "jenkins : jenkins admin" },
              { type: "error", val: "✖ Jenkins user is NOT in the docker group." },
              { type: "info", val: "Fix: Run 'sudo usermod -aG docker jenkins' and restart the agent." }
            ]
          },
          {
            id: "jenkins_agent_disk_full",
            category: "storage",
            name: "Agent Workspace Disk Exhaustion",
            cmd: "df -h /home/jenkins/workspace\ndocker system prune -af",
            explanation: "Jenkins agents build code and generate temporary files, which eventually exhaust disk space and fail builds with 'No space left on device'.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ df -h /home/jenkins/workspace" },
              { type: "log", val: "Filesystem      Size  Used Avail Use% Mounted on\n/dev/xvda1       30G   30G     0 100% /home/jenkins" },
              { type: "warning", val: "⚠ DISK CAPACITY EXHAUSTED: Workspace path is at 100% usage!" },
              { type: "prompt", val: "nikhil@ops-center:~$ docker system prune -af" },
              { type: "log", val: "Deleted Images, Containers, and Caches..." },
              { type: "success", val: "✔ Reclaimed 14.5GB of disk storage. Current disk usage at 51%." }
            ]
          }
        ],
        commands: [
          { cmd: "pipeline { agent any stages { ... } }", desc: "Skeleton syntax for a Declarative Jenkinsfile.", category: "Syntax" },
          { cmd: "environment { KEY = credentials('id') }", desc: "Inject credential secrets, masking values in console logs.", category: "Credentials" },
          { cmd: "parallel { stage('Test') { ... } }", desc: "Run multiple build stages simultaneously.", category: "Syntax" },
          { cmd: "post { failure { slackSend 'Failed' } }", desc: "Configure post-build actions based on pipeline status.", category: "Syntax" },
          { cmd: "archiveArtifacts 'target/*.jar'", desc: "Save build outputs so they can be downloaded from the UI.", category: "Build" }
        ]
      },
      terraform: {
        title: "Terraform (IaC)",
        subtitle: "Infrastructure as Code & State Management",
        category: "IaC",
        iconClass: "fas fa-cubes",
        overview: {
          desc: "Terraform lets you write your infrastructure as code using HCL. Instead of manual clicks, you describe your desired cloud setup in files, and Terraform provisions, updates, and destroys resources safely.",
          metrics: [
            { label: "Language", val: "HCL (Declarative)" },
            { label: "State Storage", val: "Remote S3 Backend" },
            { label: "State Locking", val: "DynamoDB Table" },
            { label: "Dry Run", val: "terraform plan" },
            { label: "Provider Model", val: "Plugin Architecture" },
            { label: "Code Reuse", val: "Modules" }
          ],
          concepts: [
            { title: "Declarative Code (HCL)", desc: "You define the end state ('I want 3 VMs') and Terraform calculates the API calls to build it.", icon: "fas fa-file-code" },
            { title: "State File (terraform.tfstate)", desc: "Terraform's memory. A JSON file that maps your code to real resources. Essential for tracking modifications.", icon: "fas fa-brain" },
            { title: "Remote State Locking", desc: "Storing state in S3 and locking it with DynamoDB. Prevents developers from overriding each other's applies.", icon: "fas fa-lock" },
            { title: "Terraform Plan (Dry Run)", desc: "The dry run. Shows what will be added, modified, or destroyed before making actual changes.", icon: "fas fa-search" },
            { title: "Modules (Reusability)", desc: "Reusable infrastructure packages. Create a VPC template once, reuse it for dev, staging, and production.", icon: "fas fa-box" },
            { title: "Providers (Plugins)", desc: "Plugins that teach Terraform how to interact with different cloud APIs (AWS, GCP, Kubernetes).", icon: "fas fa-plug" }
          ],
          interviewPrep: [
            {
              q: "What is the Terraform state file and why is it important?",
              a: "The state file maps your code configuration to real cloud resources. It tracks metadata, IDs, and dependencies, and is the source of truth for planning updates.",
              tip: "State files contain plain text secrets — always store them securely in encrypted S3 buckets, never in Git."
            },
            {
              q: "How does state locking work and why do we need it?",
              a: "When running apply, Terraform locks the state using a DynamoDB table. If another developer attempts to run apply simultaneously, the execution is blocked to prevent state corruption.",
              tip: "Use 'terraform force-unlock cb17-xyz' if a crash leaves a stale lock."
            },
            {
              q: "Explain the differences between plan and apply.",
              a: "Plan performs a dry run, querying the cloud and showing what will change. Apply executes the API calls to match your target state.",
              tip: "In CI/CD, output plan files: 'terraform plan -out=tfplan', then apply that exact file: 'terraform apply tfplan'."
            }
          ]
        },
        architecture: {
          intro: "Terraform reads HCL, compares it to the remote S3 state file, and applies the changes by loading cloud provider plugins (like AWS or GCP).",
          html: `
          <div class="arch-node core"><i class="fas fa-file-code"></i> <h6>Terraform Config (.tf files)</h6><span>Infrastructure Declarations in HCL</span></div>
          <div class="arch-connector-line vertical"></div>
          <div class="arch-node core"><i class="fas fa-cubes"></i> <h6>Terraform Core Engine</h6><span>Plan & Apply Execution Engine</span></div>
          <div class="arch-connector-line vertical bidirectional"><span class="arch-arrow-label">Provider Plugin API</span></div>
          <div class="arch-group">
            <span class="arch-group-title">Remote State Management</span>
            <div class="arch-node highlight"><i class="fas fa-cloud"></i> <h6>S3 State Backend</h6><span>terraform.tfstate (Encrypted)</span></div>
            <div class="arch-node highlight"><i class="fas fa-lock"></i> <h6>DynamoDB Lock Table</h6><span>Concurrent Access Prevention</span></div>
          </div>
        `,
          details: {
            title: "Terraform Execution & State Architecture",
            components: [
              { name: "HCL Config Files", desc: "HCL files defining variables, resources, provider settings, and state outputs." },
              { name: "Terraform Core", desc: "Parses HCL, builds resource dependency maps, and schedules provider execution." },
              { name: "Remote S3 Backend", desc: "Centralized storage for state data, avoiding local conflicts and enabling team collaboration." },
              { name: "DynamoDB Locking", desc: "DynamoDB tables hosting lock hashes to block concurrent operations." }
            ]
          }
        },
        workflow: {
          intro: "Terraform workflow: init the folder, write configuration, generate plans, get approval, and execute changes.",
          steps: [
            { num: 1, title: "terraform init", desc: "Download cloud provider plugins, initialize S3 backend storage, and load modules." },
            { num: 2, title: "Write HCL Code", desc: "Define cloud resources (VPCs, databases, subnets) using declarative syntax." },
            { num: 3, title: "terraform plan", desc: "Run a dry-run check comparing code with state, exporting a plan output file." },
            { num: 4, title: "Code Review", desc: "Verify plan diff outputs via pull request processes before approving changes." },
            { num: 5, title: "terraform apply", desc: "Acquire the DynamoDB lock, run API commands, provision resources, and save state." },
            { num: 6, title: "Verify Drift", desc: "Audit setups with 'terraform plan' to check for manual changes." }
          ]
        },
        scenarios: [
          {
            id: "tf_state_locked",
            category: "storage",
            name: "State File Locked (Can't Run Apply)",
            cmd: "terraform plan\nterraform force-unlock cb17c9b8-de33-4f18-67e3-0d221804abcd",
            explanation: "If a prior Terraform run crashed, the state lock in DynamoDB may persist. This command displays the lock details and forces a release.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ terraform plan" },
              { type: "error", val: "Error: Error acquiring state lock. Locked by: cb17c9b8-de33-4f18-67e3-0d221804abcd" },
              { type: "info", val: "Fix: Force release the lock using 'terraform force-unlock <ID>' after confirming no other deploy is active." }
            ]
          },
          {
            id: "tf_state_drift",
            category: "system",
            name: "State Drift — Console Changes Detected",
            cmd: "terraform plan -out=tfplan\nterraform apply -refresh-only",
            explanation: "State drift occurs when team members edit cloud resources manually via the web console. Plan detects these changes, allowing you to overwrite manual updates to match your code.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ terraform plan" },
              { type: "warning", val: "Drift detected: aws_security_group ingress rule changed manually in console." },
              { type: "info", val: "Fix: Run 'terraform apply' to overwrite manual overrides and restore HCL configs." }
            ]
          },
          {
            id: "tf_invalid_creds",
            category: "security",
            name: "Invalid Cloud Credentials Block",
            cmd: "terraform plan\naws sts get-caller-identity",
            explanation: "Expired tokens or bad secret keys will block Terraform operations. Checking STS identities identifies whether AWS credentials are active.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ terraform plan" },
              { type: "error", val: "Error: error configuring Amazon Web Services provider: AWS credentials are valid but token has expired." },
              { type: "prompt", val: "nikhil@ops-center:~$ aws sts get-caller-identity" },
              { type: "error", val: "✖ An error occurred (ExpiredToken) when calling the GetCallerIdentity operation: The security token included in the request is expired." },
              { type: "info", val: "Fix: Re-authenticate with your SSO provider or refresh environment variables (AWS_ACCESS_KEY_ID)." }
            ]
          }
        ],
        commands: [
          { cmd: "terraform init", desc: "Initialize backend, providers, and modules.", category: "Core" },
          { cmd: "terraform plan -out=tfplan", desc: "Preview changes and save execution plans to files.", category: "Core" },
          { cmd: "terraform apply tfplan", desc: "Apply a previously saved plan file.", category: "Core" },
          { cmd: "terraform destroy", desc: "Delete all infrastructure tracked in the state file.", category: "Core" },
          { cmd: "terraform fmt -recursive", desc: "Format all .tf files to canonical styles.", category: "Validation" }
        ]
      },
      monitoring: {
        title: "Prometheus & Grafana",
        subtitle: "Metrics Monitoring & Visualization",
        category: "Monitoring",
        iconClass: "fas fa-chart-line",
        overview: {
          desc: "You can't fix what you can't see. Prometheus and Grafana act as your telescope. Prometheus scrapes performance metrics from your servers and apps, while Grafana converts those raw numbers into real-time visual dashboards.",
          metrics: [
            { label: "Collection Model", val: "Pull-Based Scraping" },
            { label: "Scrape Interval", val: "15s Default" },
            { label: "Query Language", val: "PromQL" },
            { label: "Storage", val: "Time-Series DB" },
            { label: "Alert Routing", val: "Alertmanager" },
            { label: "Visualization", val: "Grafana Dashboards" }
          ],
          concepts: [
            { title: "Pull-Based Scraping", desc: "Prometheus pulls metrics by hitting endpoints (like /metrics), letting you notice server drops immediately when a fetch fails.", icon: "fas fa-cloud-download-alt" },
            { title: "Metric Types", desc: "Counter (always goes up — total requests), Gauge (fluctuates — CPU), Histogram (measures distribution — latency).", icon: "fas fa-chart-bar" },
            { title: "PromQL Queries", desc: "Query language used to slice metrics. For example: compute per-second request rates or request latency percentiles.", icon: "fas fa-search" },
            { title: "Alertmanager", desc: "Receives alerts from Prometheus, groups duplicate signals, silences maintenance events, and sends notifications to Slack.", icon: "fas fa-bell" },
            { title: "Exporters (Sources)", desc: "Exposes host statistics (Node Exporter) or container metrics (cAdvisor) on HTTP ports for Prometheus to scrape.", icon: "fas fa-plug" },
            { title: "Grafana Panels", desc: "Connects to Prometheus data, displaying real-time graphs, alerts, and tables filtered by server name.", icon: "fas fa-desktop" }
          ],
          interviewPrep: [
            {
              q: "What is the difference between pull-based and push-based monitoring?",
              a: "Pull (Prometheus) actively scrapes metrics from targets at regular intervals, making target-down detection instant. Push (Datadog) has apps push metrics to a collector, which is easier for short-lived serverless jobs but can fail silently if endpoints drop.",
              tip: "Say: 'I prefer pull-based because of clear target health detection, but use Pushgateways for ephemeral batch jobs.'"
            },
            {
              q: "How does Alertmanager work with Prometheus to prevent alert fatigue?",
              a: "Prometheus evaluates rules and fires alerts to Alertmanager. Alertmanager then groups similar alerts (e.g. 50 failing pods into 1 Slack message), inhibits child alerts if the parent node is down, and silences noise during maintenance.",
              tip: "Always mention 'grouping and inhibition' — it shows you know how to stop alert storms in production."
            },
            {
              q: "What is the difference between Node Exporter and cAdvisor?",
              a: "Node Exporter runs on the host OS to collect hardware metrics like host CPU, memory, and disk. cAdvisor runs as a container agent (or embedded in kubelet) to collect container-level resource utilization.",
              tip: "Say: 'Node Exporter checks if the server is dying; cAdvisor tells me which container is killing it.'"
            }
          ]
        },
        architecture: {
          intro: "The observability stack — Node Exporter and cAdvisor expose metrics, Prometheus scrapes and stores them, Alertmanager handles notifications, and Grafana visualizes everything in real-time dashboards.",
          html: `
          <div class="arch-group">
            <span class="arch-group-title">Metric Sources (Targets)</span>
            <div class="arch-node"><i class="fas fa-server"></i> <h6>Node Exporter</h6><span>Host CPU, RAM, Disk (Port 9100)</span></div>
            <div class="arch-node"><i class="fab fa-docker"></i> <h6>cAdvisor</h6><span>Container Metrics (Kubelet)</span></div>
            <div class="arch-node"><i class="fas fa-code"></i> <h6>App /metrics</h6><span>Custom Business Metrics</span></div>
          </div>
          <div class="arch-connector-line vertical"><span class="arch-arrow-label">HTTP Scraping (Pull Model)</span></div>
          <div class="arch-node core"><i class="fas fa-chart-line"></i> <h6>Prometheus Server</h6><span>TSDB Storage & Rule Evaluation</span></div>
          <div class="arch-connector-line vertical bidirectional"><span class="arch-arrow-label">PromQL Queries</span></div>
          <div class="arch-group">
            <span class="arch-group-title">Consumers</span>
            <div class="arch-node highlight"><i class="fas fa-desktop"></i> <h6>Grafana Dashboard</h6><span>Real-Time Visualization</span></div>
            <div class="arch-node highlight"><i class="fas fa-bell"></i> <h6>Alertmanager</h6><span>Alert Routing & Notifications</span></div>
          </div>
        `,
          details: {
            title: "Observability Stack Architecture",
            components: [
              { name: "Node Exporter", desc: "Lightweight agent exposing host-level hardware metrics (CPU, RAM, disk) on port 9100." },
              { name: "cAdvisor / Kubelet", desc: "Exposes container-level resource utilization metrics (CPU, memory, filesystem)." },
              { name: "App /metrics", desc: "Custom business metrics exposed directly by application code using client libraries." },
              { name: "Prometheus Server", desc: "Core engine that scrapes targets, stores metrics in TSDB, and evaluates alert rules." },
              { name: "Grafana", desc: "Observability dashboard that queries Prometheus to visualize real-time status graphs." },
              { name: "Alertmanager", desc: "Handles alerts, deduplicates alerts, and routes notifications to Slack or PagerDuty." }
            ]
          }
        },
        workflow: {
          intro: "Setting up monitoring: install exporters, scrape metrics, build dashboards, and route alerts.",
          steps: [
            { num: 1, title: "Install Exporters", desc: "Deploy Node Exporter and instrument code to expose a /metrics endpoint." },
            { num: 2, title: "Configure Prometheus", desc: "Add scrape targets in prometheus.yml and set the scrape interval (15s default)." },
            { num: 3, title: "Connect to Grafana", desc: "Add Prometheus as a data source and import standard monitoring dashboards." },
            { num: 4, title: "Write Alert Rules", desc: "Create alert rules in Prometheus for system limits like high CPU or error rates." },
            { num: 5, title: "Configure Alertmanager", desc: "Set up receivers like Slack with alert grouping and silencing for maintenance." },
            { num: 6, title: "Test & Iterate", desc: "Trigger test alerts, verify notifications, and tune thresholds based on traffic." }
          ]
        },
        scenarios: [
          {
            id: "mon_target_down",
            category: "network",
            name: "Prometheus Target DOWN (Scrape Failing)",
            cmd: "curl -s http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | select(.health==\"down\")'\nnc -zv -w 3 10.0.1.25 9100\nssh ubuntu@10.0.1.25 'sudo systemctl status node_exporter'",
            explanation: "When Prometheus shows a target as DOWN, it means scraping failed. This checks if the exporter is offline, if firewalls block port 9100, or if the server itself is unresponsive.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ curl -s http://localhost:9090/api/v1/targets | jq ..." },
              { type: "log", val: "{\n  \"labels\": { \"instance\": \"10.0.1.25:9100\", \"job\": \"node-metrics\" },\n  \"health\": \"down\",\n  \"lastError\": \"connection refused\"\n}" },
              { type: "error", val: "✖ Target 10.0.1.25:9100 is DOWN — Connection Refused." },
              { type: "prompt", val: "nikhil@ops-center:~$ ssh ubuntu@10.0.1.25 'sudo systemctl status node_exporter'" },
              { type: "log", val: "● node_exporter.service - Prometheus Exporter\n   Active: failed (Result: exit-code)" },
              { type: "info", val: "Fix: Restart the exporter service on target: 'sudo systemctl restart node_exporter'." }
            ]
          },
          {
            id: "mon_high_disk",
            category: "storage",
            name: "Prometheus TSDB Disk Filling Up",
            cmd: "df -h /var/lib/prometheus\nsudo sed -i 's/retention.time=30d/retention.time=15d/' /etc/default/prometheus\nsudo systemctl restart prometheus",
            explanation: "High metric cardinality can quickly exhaust disk space. This checks the TSDB disk allocation, updates retention settings to prune older data, and restarts Prometheus.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ df -h /var/lib/prometheus" },
              { type: "log", val: "Filesystem      Size  Used Avail Use% Mounted on\n/dev/xvda1       20G   19G  500M  98% /var/lib/prometheus" },
              { type: "warning", val: "⚠ DISK CRITICAL: Prometheus storage at 98% — will stop scraping soon!" },
              { type: "prompt", val: "nikhil@ops-center:~$ sudo systemctl restart prometheus" },
              { type: "log", val: "tsdb: older metric chunks successfully deleted." },
              { type: "success", val: "✔ Reclaimed 8.5GB of disk storage. Current disk usage at 55%." }
            ]
          },
          {
            id: "mon_slack_alert_fail",
            category: "network",
            name: "Slack Alert Delivery Failing",
            cmd: "curl -X POST -H 'Content-type: application/json' --data '{\"text\":\"Test Alert\"}' https://hooks.slack.com/services/...\njournalctl -xe -u prometheus-alertmanager --no-pager | tail -n 15",
            explanation: "If Alertmanager fails to route incident notifications to Slack, test the webhook URL directly and check logs for rate limits or bad webhook tokens.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ curl -X POST -H 'Content-type: application/json' --data '{\"text\":\"Test Alert\"}' https://hooks.slack.com/services/..." },
              { type: "error", val: "HTTP/1.1 404 Not Found (Invalid webhook URL payload)" },
              { type: "prompt", val: "nikhil@ops-center:~$ journalctl -xe -u prometheus-alertmanager" },
              { type: "log", val: "level=error ts=2026-05-23T12:06:12Z caller=dispatch.go:352 component=dispatcher msg=\"Notify for 1 alerts failed\" err=\"integration slack: response status code 404\"" },
              { type: "error", val: "✖ Alertmanager failed to send alert to Slack: Webhook URL is invalid (404)." },
              { type: "info", val: "Fix: Re-generate the Slack Incoming Webhook URL and update the alertmanager.yml configuration." }
            ]
          }
        ],
        commands: [
          { cmd: "up == 0", desc: "Find all targets that are currently offline or unreachable.", category: "PromQL" },
          { cmd: "rate(http_requests_total[5m])", desc: "Calculate per-second request rate over the last 5 minutes.", category: "PromQL" },
          { cmd: "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))", desc: "Find the 95th percentile of request latencies.", category: "PromQL" },
          { cmd: "promtool check config prometheus.yml", desc: "Validate Prometheus configuration file for syntax errors.", category: "CLI Tools" },
          { cmd: "amtool silence add alertname=HighCPU --duration=2h", desc: "Mute HighCPU alert notifications for a 2-hour maintenance window.", category: "CLI Tools" },
          { cmd: "docker run -d -p 3000:3000 grafana/grafana", desc: "Quick-start a local Grafana instance (access via port 3000).", category: "Setup" }
        ]
      },
      azure: {
        title: "Microsoft Azure",
        subtitle: "Enterprise Hybrid Cloud & App Services",
        category: "Infrastructure",
        iconClass: "fab fa-microsoft",
        overview: {
          desc: "Azure is Microsoft's global enterprise cloud platform, widely integrated with hybrid domains and corporate identity. For DevOps engineers, it provides seamless Active Directory bindings, scalable Kubernetes clusters, integrated App Services, and policy governance.",
          metrics: [
            { label: "Compute Engine", val: "Virtual Machines / Scalesets" },
            { label: "Managed K8s", val: "Azure AKS" },
            { label: "Identity Engine", val: "Microsoft Entra ID" },
            { label: "Security Vault", val: "Azure Key Vault" },
            { label: "Network Bridge", val: "ExpressRoute / VPN" },
            { label: "IaC Provision", val: "Bicep / ARM Templates" }
          ],
          concepts: [
            { title: "Resource Groups", desc: "Logical bucket boundaries for organizing and provisioning Azure services in standard deployment environments.", icon: "fas fa-folder" },
            { title: "Azure AKS", desc: "Fully managed Kubernetes cluster integrated with Azure Active Directory and advanced Azure CNI networks.", icon: "fas fa-dharmachakra" },
            { title: "Entra ID (Azure AD)", desc: "Corporate-grade cloud identity service controlling SSO access, app credentials, and cloud RBAC mappings.", icon: "fas fa-id-card" },
            { title: "Azure Key Vault", desc: "Secure centralized key store for locking up database strings, encryption keys, and SSL certificates.", icon: "fas fa-key" },
            { title: "App Service Plans", desc: "Fully managed PaaS hosting platform for scaling web apps and APIs without server management overhead.", icon: "fas fa-cogs" }
          ],
          interviewPrep: [
            {
              q: "What is the difference between Azure CNI and Kubenet in AKS networking?",
              a: "Azure CNI gives every Pod a real private IP from your virtual network subnet (faster performance but requires huge IP blocks). Kubenet assigns internal NAT IPs to pods, routing them through node IPs (saves IP space but has network overhead).",
              tip: "Mention the 'IP exhaustion risk' in Azure CNI to show your production experience."
            },
            {
              q: "How does Azure manage resources securely compared to AWS?",
              a: "Azure organizes resources hierarchically: Management Groups -> Subscriptions -> Resource Groups -> Resources. Permissions flow down this chain using role-based access control (RBAC).",
              tip: "Highlight: 'I bundle resources under a single Resource Group to manage billing and apply clean policies.'"
            }
          ]
        },
        architecture: {
          intro: "An enterprise Azure hub-spoke model: traffic is resolved via DNS, hits Azure Application Gateway inside a secure VNet subnet, routes to AKS cluster pods, and writes to a managed Azure SQL DB.",
          html: `
          <div class="arch-node highlight"><i class="fas fa-globe"></i> <h6>Azure Traffic Manager</h6><span>Global DNS Routing & Geo Failover</span></div>
          <div class="arch-connector-line vertical"></div>
          <div class="arch-node core"><i class="fas fa-shield-alt"></i> <h6>Azure Application Gateway</h6><span>WAF Security & L7 SSL Offload</span></div>
          <div class="arch-connector-line vertical"></div>
          <div class="arch-group">
            <span class="arch-group-title">Virtual Network Subnet App Tier</span>
            <div class="arch-node core"><i class="fas fa-dharmachakra"></i> <h6>Azure AKS Nodes</h6><span>Azure CNI Container Pods</span></div>
            <div class="arch-node"><i class="fas fa-server"></i> <h6>App Service Plan</h6><span>Scalable PaaS App Hosts</span></div>
          </div>
          <div class="arch-connector-line vertical"></div>
          <div class="arch-node highlight"><i class="fas fa-database"></i> <h6>Azure SQL Database</h6><span>Managed PostgreSQL/SQL Server</span></div>
        `,
          details: {
            title: "Azure Enterprise Multi-Tier Architecture",
            components: [
              { name: "Traffic Manager", desc: "DNS load balancer resolving client domains to the nearest healthy regional backend endpoint." },
              { name: "Application Gateway WAF", desc: "Handles Layer 7 load balancing, SSL/TLS termination, and blocks common web exploits via firewall rules." },
              { name: "AKS (Azure Kubernetes)", desc: "Orchestrates container workloads directly on VM scale sets using Azure native networking plugins." },
              { name: "Azure SQL DB", desc: "Fully managed enterprise database with automated failover replication and seamless point-in-time recovery." }
            ]
          }
        },
        workflow: {
          intro: "Azure deployment lifecycle: initiate a Resource Group, write Bicep templates, allocate Key Vault secrets, deploy AKS, and monitor.",
          steps: [
            { num: 1, title: "Create Resource Group", desc: "Initialize a localized Resource Group boundary for your environments." },
            { num: 2, title: "Configure VNet Subnets", desc: "Design subnets, Network Security Groups, and configure private route endpoints." },
            { num: 3, title: "Store Secrets", desc: "Provision an Azure Key Vault and lock up API keys and DB strings safely." },
            { num: 4, title: "Deploy AKS Cluster", desc: "Launch AKS nodes using Azure CLI or Bicep scripts and configure autoscalers." },
            { num: 5, title: "Apply RBAC Policies", desc: "Configure Entra ID access roles and apply Azure Policies to block public storage access." },
            { num: 6, title: "Monitor & Metrics", desc: "Scrape logs using Azure Log Analytics and create Azure Monitor graphs." }
          ]
        },
        scenarios: [
          {
            id: "azure_nsg_block",
            category: "network",
            name: "VM Network Security Group Block",
            cmd: "az network nsg rule list --resource-group ops-rg --nsg-name web-vm-nsg --query \"[].{Name:name,Port:destinationPortRange,Access:access}\"\nnc -zv -w 3 13.77.200.12 443",
            explanation: "If an Azure Virtual Machine is unreachable, check the associated Network Security Group rules to see if incoming port 443 is blocked or denied.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ az network nsg rule list..." },
              { type: "log", val: "[\n  { \"Name\": \"AllowSSH\", \"Port\": \"22\", \"Access\": \"Allow\" },\n  { \"Name\": \"DenyAllInbound\", \"Port\": \"*\", \"Access\": \"Deny\" }\n]" },
              { type: "error", val: "✖ Port 443 (HTTPS) is BLOCKED. All traffic not matching port 22 is Denied." },
              { type: "info", val: "Fix: Add a high-priority inbound security rule in NSG allowing port 443." }
            ]
          },
          {
            id: "azure_aks_ip_exhaustion",
            category: "system",
            name: "AKS Subnet IP Exhaustion",
            cmd: "az aks show --resource-group ops-rg --name prod-aks --query \"networkProfile\"\naz network vnet subnet show --resource-group ops-rg --vnet-name hub-vnet --name aks-subnet --query \"ipConfigurations | length(@)\"",
            explanation: "AKS clusters using Azure CNI allocate a real network IP to every single pod. If your CIDR block is too small, scaling up pods fails with IP allocation errors.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ az network vnet subnet show..." },
              { type: "log", val: "Subnet: aks-subnet, Prefix: 10.0.1.0/24 (251 active allocations, 5 free IPs)" },
              { type: "warning", val: "⚠ IP LIMIT WARNING: aks-subnet has 98% IP allocation rate." },
              { type: "error", val: "✖ Subnet IP exhaustion: Pods cannot boot due to lack of network IPs." },
              { type: "info", val: "Fix: Deploy AKS clusters on a larger subnet (/20) or switch AKS network model to Kubenet." }
            ]
          }
        ],
        commands: [
          { cmd: "az login", desc: "Log in interactively to your Microsoft Azure account credentials.", category: "Setup" },
          { cmd: "az group create --name ops-rg --location eastus", desc: "Create a new resource container boundary.", category: "Core" },
          { cmd: "az vm list --output table", desc: "List all Azure virtual servers and their run states in a table.", category: "Compute" },
          { cmd: "az aks get-credentials --resource-group ops-rg --name prod-aks", desc: "Download the cluster kubeconfig to run kubectl commands locally.", category: "AKS" },
          { cmd: "az keyvault secret show --name db-secret --vault-name prod-vault", desc: "Retrieve a secure password string from Key Vault.", category: "Security" }
        ]
      },
      linux: {
        title: "Linux OS",
        subtitle: "System Administration, Scripting & Networking",
        category: "Operating System",
        iconClass: "fab fa-linux",
        overview: {
          desc: "Linux is the lifeblood of DevOps. Every container, virtual server, and cloud automation tool runs on Linux. Mastering Linux requires deep knowledge of process lifecycles, memory boundaries, storage block structures, networking sockets, shell scripting, and security rules.",
          metrics: [
            { label: "Core Kernel", val: "Linux LTS Stable" },
            { label: "Init Daemon", val: "Systemd / SystemV" },
            { label: "Default Shell", val: "Bash / Bourne" },
            { label: "Networking", val: "IPtables / Socket" },
            { label: "Packages", val: "APT / YUM / DNF" },
            { label: "File Interface", val: "Virtual Filesystem" }
          ],
          concepts: [
            { title: "Systemd & Services", desc: "The modern init system that bootstraps user space and monitors background server daemons (sshd, syslog).", icon: "fas fa-cogs" },
            { title: "Virtual Filesystem (VFS)", desc: "Linux abstracts everything (devices, sockets, RAM) as a file. Storage disks mount into virtual paths.", icon: "fas fa-folder-open" },
            { title: "Processes & Signals", desc: "Programs running in isolated memory spaces. Standard signals (SIGTERM, SIGKILL) control their runtimes.", icon: "fas fa-tasks" },
            { title: "Sockets & Ports", desc: "Network connection points bounded by IP address and port, managed via routing tables and interface controllers.", icon: "fas fa-network-wired" },
            { title: "File Permissions", desc: "The security framework (Read, Write, Execute) mapped to Owner, Group, and Public scopes via chmod.", icon: "fas fa-shield-alt" }
          ],
          interviewPrep: [
            {
              q: "Explain the difference between a Hard Link and a Soft Link (Symlink) in Linux.",
              a: "A Hard Link is an additional pointer directly to the file's underlying disk block (Inode). A Soft Link is a shortcut pointing to the file's text path. If the original file is deleted, hard links still work, but soft links break.",
              tip: "Mention that hard links cannot cross filesystems or link to directories."
            },
            {
              q: "How do you find which process is holding a network port open?",
              a: "Run 'sudo ss -tulpn | grep <port>' or 'sudo lsof -i :<port>'. This displays the process name, socket state, and exact PID so you can debug or kill the process.",
              tip: "ss is newer and faster than netstat; lsof lists open file descriptors."
            },
            {
              q: "What is an Inode and what happens if you run out of them?",
              a: "An Inode is a metadata structure containing file sizes, owners, and disk pointers. If you exhaust Inodes (df -i reaches 100%), you cannot create any new files, even if the disk has gigabytes of free physical space.",
              tip: "Say: 'This commonly happens when millions of tiny session or cache files fill up a directory.'"
            }
          ]
        },
        architecture: {
          intro: "The layers of a Linux operating system: User Space programs (shells, nginx, docker) interface via the System Call interface (glibc) with the secure Kernel Space, which coordinates physical CPUs, RAM, and connected network cards.",
          html: `
          <div class="arch-node highlight"><i class="fas fa-user-alt"></i> <h6>User Space (Applications)</h6><span>Bash Shell, Nginx Web Server, Docker Containers</span></div>
          <div class="arch-connector-line vertical"><span class="arch-arrow-label">System Call API (glibc)</span></div>
          <div class="arch-node core"><i class="fab fa-linux"></i> <h6>Linux Kernel Space</h6><span>Process Scheduler, Virtual Memory, VFS, Network Stack</span></div>
          <div class="arch-connector-line vertical bidirectional"></div>
          <div class="arch-group">
            <span class="arch-group-title">Physical / Hypervisor Hardware</span>
            <div class="arch-node"><i class="fas fa-cpu"></i> <h6>CPU & Memory</h6><span>Scheduler & RAM Manager</span></div>
            <div class="arch-node"><i class="fas fa-hdd"></i> <h6>Block Storage</h6><span>HDD / SSD / NVMe Drive</span></div>
            <div class="arch-node"><i class="fas fa-network-wired"></i> <h6>Network Interface</h6><span>NIC Card / virtual bridge</span></div>
          </div>
        `,
          details: {
            title: "Linux Operating System Subsystem Model",
            components: [
              { name: "User Space", desc: "The non-privileged system area where user applications, command shells, and container tasks execute." },
              { name: "System Call Interface", desc: "The boundary gateway (glibc APIs) that translates user space functions into privileged kernel operations." },
              { name: "Linux Kernel Core", desc: "The system brain. Handles process scheduling, allocates RAM boundaries, and reads block devices." },
              { name: "Virtual Filesystem (VFS)", desc: "Abstracts various filesystems (ext4, nfs, sysfs) into a single unified virtual folder structure." }
            ]
          }
        },
        workflow: {
          intro: "Linux operational lifecycle: GRUB boot manager starts Kernel, Systemd loads services, bash processes handle scripts, and virtual metrics populate `/proc`.",
          steps: [
            { num: 1, title: "System Boot (Systemd)", desc: "UEFI/GRUB starts kernel, mounts Root FS, and hands over to systemd daemon." },
            { num: 2, title: "Shell Boot (Bash)", desc: "SSHD logs in user, reads .bashrc, compiles path variables, and sets active shell." },
            { num: 3, title: "Process Scheduling", desc: "Kernel allocates memory pages and schedules process execution time slices on CPU." },
            { num: 4, title: "I/O Write Operations", desc: "Processes write data block allocations down filesystem interfaces to disk controllers." },
            { num: 5, title: "Socket Connections", desc: "Network processes bind TCP ports, listening on ethernet cards for client packets." },
            { num: 6, title: "Telemetry Accounting", desc: "Kernel tracks hardware metrics inside virtual /proc paths, scraped by monitoring agents." }
          ]
        },
        scenarios: [
          {
            id: "linux_cpu_load",
            category: "system",
            name: "High CPU Load Average Debugging",
            cmd: "uptime\ntop -b -n 1 | head -n 15\nps aux --sort=-%cpu | head -n 5",
            explanation: "A high load average indicates a process backup queue. Uptime gives system averages, top audits CPU/RAM states, and ps lists CPU-hogging runaway processes.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ uptime" },
              { type: "log", val: "12:05:32 up 45 days, 4:12, 2 users, load average: 8.52, 5.12, 2.30" },
              { type: "warning", val: "⚠ LOAD AVERAGE WARNING: Active load queue (8.52) is extremely high on this 2-Core CPU!" },
              { type: "prompt", val: "nikhil@ops-center:~$ ps aux --sort=-%cpu | head -n 5" },
              { type: "log", val: "USER      PID  %CPU %MEM  VSZ    RSS   TTY  STAT START TIME COMMAND\nwww-data  1452 96.5 8.2   245000 85000 ?    R    12:01 4:15 php-fpm: www-pool" },
              { type: "error", val: "✖ PID 1452 (php-fpm process) is running at 96.5% CPU in an active infinite loop." },
              { type: "info", val: "Fix: Gracefully stop or kill the runaway process PID: 'sudo kill -15 1452'." }
            ]
          },
          {
            id: "linux_port_conflict",
            category: "network",
            name: "Network Port Binding Conflict",
            cmd: "sudo ss -tulpn | grep 8080\nsudo lsof -i :8080",
            explanation: "Port bind conflicts occur when two applications attempt to listen on the exact same port. ss and lsof locate the process holding the target port.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ sudo ss -tulpn | grep 8080" },
              { type: "log", val: "tcp   LISTEN 0   128   *:8080   *:*   users:((\"python3\",pid=8421,fd=3))" },
              { type: "error", val: "✖ Network Port 8080 is already held by python3 (PID 8421)." },
              { type: "info", val: "Fix: Stop the conflicting process: 'sudo kill -9 8421' and reboot your target service." }
            ]
          },
          {
            id: "linux_disk_inodes",
            category: "storage",
            name: "Disk Space Full (Inode Exhaustion)",
            cmd: "df -h\ndf -i",
            explanation: "Sometimes block writes are rejected even though df -h shows free space. This is caused by Inode exhaustion, occurring when millions of tiny files eat up index headers.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ df -h" },
              { type: "log", val: "Filesystem      Size  Used Avail Use% Mounted on\n/dev/xvda1       40G   22G   18G  55% /" },
              { type: "prompt", val: "nikhil@ops-center:~$ df -i" },
              { type: "log", val: "Filesystem      Inodes  IUsed IFree IUse% Mounted on\n/dev/xvda1        2.5M   2.5M     0  100% /" },
              { type: "error", val: "✖ INODE SYSTEM FULL: Disk index limits exhausted (100% Inode utilization)!" },
              { type: "info", val: "Fix: Audit session or temporary cache paths (e.g. /var/lib/php/sessions) and delete obsolete tiny files." }
            ]
          },
          {
            id: "linux_ssh_bruteforce",
            category: "security",
            name: "SSH Unauthorized Login Attempts",
            cmd: "sudo tail -n 10 /var/log/auth.log | grep \"Failed password\"\nsudo fail2ban-client status sshd",
            explanation: "Repeated failed passwords from unknown WAN IPs denote automated brute-force attempts. Journal logs list failures and fail2ban manages automated firewall bans.",
            output: [
              { type: "prompt", val: "nikhil@ops-center:~$ sudo tail -n 10 /var/log/auth.log" },
              { type: "log", val: "Failed password for invalid user admin from 192.168.1.100 port 4825 ssh2\nFailed password for root from 192.168.1.100 port 4830 ssh2" },
              { type: "warning", val: "⚠ SECURITY EXPLOIT ALERT: Repeated failed SSH logins detected from IP 192.168.1.100." },
              { type: "prompt", val: "nikhil@ops-center:~$ sudo fail2ban-client status sshd" },
              { type: "log", val: "Status for the jail: sshd\n|- Filter\n|  |- Currently failed: 5\n`- Actions\n   |- Banned IP list: 192.168.1.100" },
              { type: "success", val: "✔ Fail2ban has successfully isolated brute-force IP 192.168.1.100 under local iptables ban rules." }
            ]
          }
        ],
        commands: [
          { cmd: "top", desc: "Open an interactive real-time monitor for system memory, tasks, and CPU load.", category: "Processes" },
          { cmd: "df -h", desc: "Show physical disk capacity and free storage boundaries of all mounts.", category: "Storage" },
          { cmd: "ss -tulpn", desc: "List all active TCP and UDP connections with corresponding server PIDs.", category: "Networking" },
          { cmd: "journalctl -xe -u nginx", desc: "Retrieve startup boot console logs for nginx service to debug fail states.", category: "Logs" },
          { cmd: "chmod 755 script.sh", desc: "Set read/execute rights for group/others, and write privileges to file owner.", category: "Permissions" },
          { cmd: "tail -f /var/log/syslog", desc: "Follow global active system log events live inside terminal.", category: "Logs" }
        ]
      }
    };

    /* ============================================================
       PLAYBOOK CONTROLLER — INTERACTIVE UI LOGIC
       ============================================================ */
    let activeTool = "aws";
    let activeTab = "overview";
    let activeScenarioIndex = 0;
    let isTyping = false;
    let activeCommandCategory = "All";
    let activeScenarioCategory = "All";

    const toolSelectorBtns = document.querySelectorAll(".selector-btn");
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".hub-tab-content");
    const cliSubBtns = document.querySelectorAll(".cli-sub-btn");

    // DOM Elements
    const hubToolIcon = document.getElementById("hub-tool-icon");
    const hubToolTitle = document.getElementById("hub-tool-title");
    const hubToolSubtitle = document.getElementById("hub-tool-subtitle");
    const hubToolCategory = document.getElementById("hub-tool-category");

    const overviewDescText = document.getElementById("overview-desc-text");
    const overviewMetrics = document.getElementById("overview-metrics");
    const overviewConceptsList = document.getElementById("overview-concepts-list");
    const overviewInterviewPrep = document.getElementById("overview-interview-prep");

    const archIntroText = document.getElementById("arch-intro-text");
    const architectureCanvas = document.getElementById("architecture-canvas");
    const architectureDetails = document.getElementById("architecture-details");

    const workflowIntroText = document.getElementById("workflow-intro-text");
    const workflowTimeline = document.getElementById("workflow-timeline");

    const scenarioList = document.getElementById("scenario-list");
    const terminalBody = document.getElementById("terminal-body");
    const terminalExplanationText = document.getElementById("terminal-explanation-text");

    const btnCopyCommand = document.getElementById("btn-copy-command");
    const btnRunCommand = document.getElementById("btn-run-command");

    // Commands tab elements
    const commandsSearch = document.getElementById("commands-search");
    const commandsCategoryFilters = document.getElementById("commands-category-filters");
    const commandsList = document.getElementById("commands-list");
    const commandsCount = document.getElementById("commands-count");

    // Load active tool data into the UI
    const loadToolPlaybook = (toolKey) => {
      const data = devopsToolData[toolKey];
      if (!data) return;

      activeTool = toolKey;
      activeScenarioIndex = 0;
      activeCommandCategory = "All";

      // 1. Update tool header
      hubToolIcon.innerHTML = `<i class="${data.iconClass}"></i>`;
      hubToolTitle.textContent = data.title;
      hubToolSubtitle.textContent = data.subtitle;
      hubToolCategory.textContent = data.category;

      // 2. Load Overview Tab
      overviewDescText.textContent = data.overview.desc;

      overviewMetrics.innerHTML = "";
      data.overview.metrics.forEach(m => {
        overviewMetrics.innerHTML += `
        <div class="metric-card">
          <span>${m.label}</span>
          <strong>${m.val}</strong>
        </div>
      `;
      });

      overviewConceptsList.innerHTML = "";
      data.overview.concepts.forEach(c => {
        overviewConceptsList.innerHTML += `
        <li class="concept-item">
          <div class="concept-icon"><i class="${c.icon}"></i></div>
          <div class="concept-text">
            <h5>${c.title}</h5>
            <p>${c.desc}</p>
          </div>
        </li>
      `;
      });

      // Interview Prep Section
      overviewInterviewPrep.innerHTML = "";
      if (data.overview.interviewPrep && data.overview.interviewPrep.length > 0) {
        let prepHTML = `
        <h4><i class="fas fa-graduation-cap"></i> Interview Prep & Real Talk</h4>
        <p class="selector-instruction" style="text-align: left; margin-bottom: 1.5rem;">High-yield interview questions with simple, mentor-style explanations. Study these before your next interview:</p>
        <div class="qna-list">
      `;
        data.overview.interviewPrep.forEach(qna => {
          prepHTML += `
          <div class="qna-card">
            <div class="qna-question">
              <span class="qna-badge-q">Q</span>
              <span>${qna.q}</span>
            </div>
            <div class="qna-answer">
              <span class="qna-badge-a">A</span>
              <div class="qna-answer-content">
                <p>${qna.a.replace(/\n/g, "<br>")}</p>
                <div class="qna-interview-tip">
                  <strong>💡 Senior Mentor Tip</strong>
                  ${qna.tip}
                </div>
              </div>
            </div>
          </div>
        `;
        });
        prepHTML += `</div>`;
        overviewInterviewPrep.innerHTML = prepHTML;
      }

      // 3. Load Architecture Tab
      archIntroText.textContent = data.architecture.intro;
      architectureCanvas.innerHTML = data.architecture.html;

      architectureDetails.innerHTML = "";
      if (data.architecture.details) {
        const details = data.architecture.details;
        let detailsHTML = `
        <h5><i class="fas fa-sitemap"></i> ${details.title}</h5>
        <ul class="arch-component-list">
      `;
        details.components.forEach(comp => {
          detailsHTML += `
          <li class="arch-component-item">
            <h6><i class="fas fa-caret-right"></i> ${comp.name}</h6>
            <p>${comp.desc}</p>
          </li>
        `;
        });
        detailsHTML += `</ul>`;
        architectureDetails.innerHTML = detailsHTML;
      }

      // 4. Load Workflow Tab
      workflowIntroText.textContent = data.workflow.intro;
      workflowTimeline.innerHTML = "";
      data.workflow.steps.forEach(s => {
        workflowTimeline.innerHTML += `
        <div class="workflow-step">
          <div class="step-num">${s.num}</div>
          <h5>${s.title}</h5>
          <p>${s.desc}</p>
        </div>
      `;
      });

      // 5. Load Troubleshooting Scenarios
      // Reset the sub-tab filters back to "All" when switching between different tools
      cliSubBtns.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      const allBtn = Array.from(cliSubBtns).find(b => b.getAttribute("data-category") === "All");
      if (allBtn) {
        allBtn.classList.add("active");
        allBtn.setAttribute("aria-selected", "true");
      }
      activeScenarioCategory = "All";

      // Toggle custom active-tool class on the terminal wrapper for custom styles
      const cliTerminal = document.querySelector(".cli-terminal");
      if (cliTerminal) {
        cliTerminal.classList.forEach(className => {
          if (className.startsWith("tool-")) {
            cliTerminal.classList.remove(className);
          }
        });
        cliTerminal.classList.add(`tool-${toolKey}`);
      }

      renderFilteredScenarios(toolKey);

      // 6. Load Commands Reference Tab
      loadCommandsTab(toolKey);
    };

    // Render filtered troubleshooting scenarios based on active category tab
    const renderFilteredScenarios = (toolKey) => {
      const data = devopsToolData[toolKey];
      if (!data || !data.scenarios) return;

      scenarioList.innerHTML = "";
      const filtered = data.scenarios.filter(sc => {
        return activeScenarioCategory === "All" || sc.category.toLowerCase() === activeScenarioCategory.toLowerCase();
      });

      if (filtered.length === 0) {
        scenarioList.innerHTML = `<div class="no-scenarios" style="color: var(--muted); font-size: 1.3rem; padding: 1.6rem 1.2rem; text-align: center; font-weight: 500;">No scenarios found for this category.</div>`;
        terminalBody.innerHTML = `
          <div class="terminal-line welcome">
            <span class="typed-text-placeholder">No troubleshooting scenarios available for category: <strong style="color: var(--amber);">${activeScenarioCategory}</strong></span>
          </div>
        `;
        terminalExplanationText.textContent = "Select another category to view scenarios.";
        return;
      }

      filtered.forEach((sc, filteredIdx) => {
        const originalIdx = data.scenarios.findIndex(s => s.id === sc.id);
        const activeClass = filteredIdx === 0 ? "active" : "";
        scenarioList.innerHTML += `
          <button class="scenario-btn ${activeClass}" data-index="${originalIdx}">
            ${sc.name}
          </button>
        `;
      });

      const scenarioBtns = scenarioList.querySelectorAll(".scenario-btn");
      scenarioBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
          if (isTyping) return;
          scenarioBtns.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          const idx = parseInt(btn.getAttribute("data-index"));
          activeScenarioIndex = idx;
          loadScenarioDetails(toolKey, idx);
        });
      });

      const firstOriginalIdx = data.scenarios.findIndex(s => s.id === filtered[0].id);
      activeScenarioIndex = firstOriginalIdx;
      loadScenarioDetails(toolKey, firstOriginalIdx);
    };

    // Load scenario details into the CLI Terminal
    const loadScenarioDetails = (toolKey, scenarioIdx) => {
      const data = devopsToolData[toolKey];
      if (!data || !data.scenarios[scenarioIdx]) return;

      const sc = data.scenarios[scenarioIdx];
      terminalExplanationText.textContent = sc.explanation;

      terminalBody.innerHTML = `
      <div class="terminal-line welcome">
        <span class="term-prompt">nikhil@ops-center:~$</span> <span class="typed-text-placeholder">Click the 'Run' button to execute the troubleshooting playbook...</span>
      </div>
      <div class="terminal-line" style="margin-top: 1rem; color: #a4b3c6; opacity: 0.85;">
        <span style="color: #facc15; font-weight: bold;">Playbook Command loaded:</span>
        <pre style="font-family: inherit; margin-top: 0.5rem; white-space: pre-wrap; font-size: 1.25rem;">${sc.cmd}</pre>
      </div>
    `;
    };

    // Load Commands Reference Tab
    const loadCommandsTab = (toolKey) => {
      const data = devopsToolData[toolKey];
      if (!data || !data.commands) return;

      activeCommandCategory = "All";
      if (commandsSearch) commandsSearch.value = "";

      // Build category pills
      const categories = ["All", ...new Set(data.commands.map(c => c.category))];
      commandsCategoryFilters.innerHTML = "";
      categories.forEach(cat => {
        commandsCategoryFilters.innerHTML += `
        <button class="cmd-cat-pill ${cat === 'All' ? 'active' : ''}" data-category="${cat}">${cat}</button>
      `;
      });

      // Wire up category filter clicks
      const catPills = commandsCategoryFilters.querySelectorAll(".cmd-cat-pill");
      catPills.forEach(pill => {
        pill.addEventListener("click", () => {
          catPills.forEach(p => p.classList.remove("active"));
          pill.classList.add("active");
          activeCommandCategory = pill.getAttribute("data-category");
          renderFilteredCommands(toolKey);
        });
      });

      renderFilteredCommands(toolKey);
    };

    // Render filtered commands based on search and category
    const renderFilteredCommands = (toolKey) => {
      const data = devopsToolData[toolKey];
      if (!data || !data.commands) return;

      const searchTerm = commandsSearch ? commandsSearch.value.toLowerCase().trim() : "";
      const filtered = data.commands.filter(c => {
        const matchesCategory = activeCommandCategory === "All" || c.category === activeCommandCategory;
        const matchesSearch = !searchTerm ||
          c.cmd.toLowerCase().includes(searchTerm) ||
          c.desc.toLowerCase().includes(searchTerm) ||
          c.category.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
      });

      commandsList.innerHTML = "";
      filtered.forEach(c => {
        commandsList.innerHTML += `
        <div class="cmd-card">
          <div class="cmd-card-header">
            <code class="cmd-syntax">${c.cmd}</code>
            <button class="cmd-copy-btn" data-cmd="${c.cmd.replace(/"/g, '&quot;')}"><i class="far fa-copy"></i> Copy</button>
          </div>
          <p class="cmd-desc">${c.desc}</p>
          <div class="cmd-meta">
            <span class="cmd-tag cat-tag">${c.category}</span>
          </div>
        </div>
      `;
      });

      commandsCount.textContent = `Showing ${filtered.length} of ${data.commands.length} commands`;

      // Wire up copy buttons
      commandsList.querySelectorAll(".cmd-copy-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const cmdText = btn.getAttribute("data-cmd");
          navigator.clipboard.writeText(cmdText).then(() => {
            btn.innerHTML = `<i class="fas fa-check"></i> Copied!`;
            setTimeout(() => {
              btn.innerHTML = `<i class="far fa-copy"></i> Copy`;
            }, 1500);
          }).catch(err => console.error("Copy failed:", err));
        });
      });
    };

    // Search input handler
    if (commandsSearch) {
      commandsSearch.addEventListener("input", () => {
        renderFilteredCommands(activeTool);
      });
    }

    // Terminal typing simulation
    const executeTerminalPlaybook = () => {
      const data = devopsToolData[activeTool];
      if (!data || !data.scenarios[activeScenarioIndex] || isTyping) return;

      isTyping = true;
      btnRunCommand.disabled = true;
      btnRunCommand.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Running...`;

      const sc = data.scenarios[activeScenarioIndex];
      terminalBody.innerHTML = "";

      const commandLines = sc.cmd.split("\n").filter(line => line.trim().length > 0 && !line.startsWith("#"));
      let commandIdx = 0;

      const typeNextCommandLine = () => {
        if (commandIdx >= commandLines.length) {
          renderTerminalOutput(sc.output);
          return;
        }

        const rawLineText = commandLines[commandIdx];
        const lineContainer = document.createElement("div");
        lineContainer.className = "terminal-line";
        lineContainer.innerHTML = `<span class="term-prompt">nikhil@ops-center:~$ </span><span class="term-command"></span><span class="cli-cursor"></span>`;
        terminalBody.appendChild(lineContainer);
        terminalBody.scrollTop = terminalBody.scrollHeight;

        const commandSpan = lineContainer.querySelector(".term-command");
        const cursorSpan = lineContainer.querySelector(".cli-cursor");

        let charIdx = 0;
        const typeChar = () => {
          if (charIdx < rawLineText.length) {
            commandSpan.textContent += rawLineText.charAt(charIdx);
            charIdx++;
            setTimeout(typeChar, 15);
          } else {
            cursorSpan.remove();
            commandIdx++;
            setTimeout(typeNextCommandLine, 250);
          }
        };
        typeChar();
      };

      typeNextCommandLine();
    };

    const renderTerminalOutput = (outputLines) => {
      let outputIdx = 0;

      const printNextOutputLine = () => {
        if (outputIdx >= outputLines.length) {
          isTyping = false;
          btnRunCommand.disabled = false;
          btnRunCommand.innerHTML = `<i class="fas fa-play"></i> Run`;
          return;
        }

        const line = outputLines[outputIdx];
        const outputLineDiv = document.createElement("div");
        outputLineDiv.className = "terminal-line";

        if (line.type === "prompt") {
          outputLineDiv.innerHTML = `<span class="term-prompt">nikhil@ops-center:~$ </span><span class="term-command" style="color: #a4b3c6;">${line.val.substring(line.val.indexOf(" ") + 1)}</span>`;
        } else {
          outputLineDiv.innerHTML = `<span class="term-output-log ${line.type}">${line.val}</span>`;
        }

        terminalBody.appendChild(outputLineDiv);
        terminalBody.scrollTop = terminalBody.scrollHeight;
        outputIdx++;

        setTimeout(printNextOutputLine, 350);
      };

      printNextOutputLine();
    };

    // Wire up tool selector
    toolSelectorBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        if (isTyping) return;
        toolSelectorBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const toolKey = btn.getAttribute("data-tool");
        loadToolPlaybook(toolKey);
      });
    });

    // Wire up troubleshooting sub-tabs
    cliSubBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        if (isTyping) return;
        cliSubBtns.forEach(b => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        activeScenarioCategory = btn.getAttribute("data-category");
        renderFilteredScenarios(activeTool);
      });
    });

    // Wire up tab controllers
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        if (isTyping) return;

        tabBtns.forEach(b => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");

        const tabKey = btn.getAttribute("data-tab");
        activeTab = tabKey;

        tabContents.forEach(content => {
          content.classList.remove("active");
          if (content.getAttribute("id") === `content-${tabKey}`) {
            content.classList.add("active");
          }
        });
      });
    });

    // Copy command button
    btnCopyCommand.addEventListener("click", () => {
      const data = devopsToolData[activeTool];
      if (!data || !data.scenarios[activeScenarioIndex]) return;

      const cmdText = data.scenarios[activeScenarioIndex].cmd;
      navigator.clipboard.writeText(cmdText).then(() => {
        btnCopyCommand.innerHTML = `<i class="fas fa-check"></i> Copied!`;
        setTimeout(() => {
          btnCopyCommand.innerHTML = `<i class="far fa-copy"></i> Copy`;
        }, 2000);
      }).catch(err => {
        console.error("Could not copy commands to clipboard: ", err);
      });
    });

    // Execute terminal playbook
    btnRunCommand.addEventListener("click", () => {
      executeTerminalPlaybook();
    });

    // Initialize with AWS
    loadToolPlaybook("aws");
  }
});
