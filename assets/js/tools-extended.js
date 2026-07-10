/**
 * DevOps Tools Extended Data — Podman & OpenShift
 * Injects into window.devopsToolData after script.js initializes it.
 * Loaded after script.js and professional-upgrade.js in index.html.
 */
(function () {
  'use strict';

  function injectToolData() {
    // Wait until window.devopsToolData is available (set by script.js on DOMContentLoaded)
    if (!window.devopsToolData) {
      setTimeout(injectToolData, 80);
      return;
    }

    /* ================================================================
       PODMAN — Full Playbook Data
    ================================================================ */
    window.devopsToolData.podman = {
      title: "Podman",
      subtitle: "Rootless, Daemon-less Container Engine",
      category: "Containers",
      iconClass: "fas fa-cube",
      overview: {
        desc: "Podman is a daemonless, rootless OCI container engine designed as a drop-in replacement for Docker. Unlike Docker, Podman does NOT run a background daemon process — each container is a direct child process of the user shell. This makes it more secure, systemd-native, and ideal for production Linux servers without root access.",
        metrics: [
          { label: "Architecture", val: "Fork-exec (No Daemon)" },
          { label: "Security Model", val: "Rootless by Default" },
          { label: "OCI Compliant", val: "100% Compatible" },
          { label: "Pods Support", val: "Native K8s Pods" },
          { label: "Compose Support", val: "podman-compose" },
          { label: "Systemd Integration", val: "Generate Unit Files" }
        ],
        concepts: [
          { title: "Daemon-less Architecture", desc: "No background daemon process. Each 'podman run' spawns the container as a direct child process. If the Docker daemon dies, all containers die. Podman avoids this entirely — no single point of failure.", icon: "fas fa-cog" },
          { title: "Rootless Containers", desc: "Containers can run as non-root users using user namespace remapping. This eliminates the critical Docker security risk of containers running as root on the host OS.", icon: "fas fa-shield-alt" },
          { title: "OCI & Docker Compatible", desc: "Podman uses the same OCI image format as Docker. You can pull Docker Hub images, use Dockerfiles, and mount Docker volumes without any modification.", icon: "fas fa-check-circle" },
          { title: "Pods (Like Kubernetes)", desc: "Podman natively supports Pods — groups of containers sharing a network namespace. You can generate a Kubernetes YAML from a Podman pod with a single command.", icon: "fas fa-cubes" },
          { title: "Systemd Integration", desc: "Podman generates systemd service unit files for any container. Containers restart automatically on boot without needing Docker Compose or Kubernetes.", icon: "fas fa-server" },
          { title: "Podman Compose", desc: "Drop-in replacement for docker-compose. Reads the same docker-compose.yml files and launches multi-container apps using Podman's rootless engine.", icon: "fas fa-boxes" }
        ],
        interviewPrep: [
          {
            q: "What is the main architectural difference between Podman and Docker?",
            a: "Docker uses a central background daemon (dockerd) that manages all containers. If it crashes, all containers die. Podman uses a fork-exec model — each container is a direct child process of the shell. No single point of failure exists.",
            tip: "Say: 'Podman's daemon-less design is more secure and integrates naturally with systemd process supervision.'"
          },
          {
            q: "How do you auto-start a Podman container on system reboot?",
            a: "Run 'podman generate systemd --name mycontainer --files --new' to generate a .service unit file. Copy it to ~/.config/systemd/user/ and enable it with 'systemctl --user enable container-mycontainer'. On system boot, systemd manages the container lifecycle.",
            tip: "This is the Podman-native answer — avoid saying 'docker-compose restart: always' in a Podman interview."
          },
          {
            q: "Can Podman run Docker Compose files? How?",
            a: "Yes. Install 'podman-compose' — a Python utility that reads docker-compose.yml and translates it into Podman API calls. All the same YAML syntax works, including volumes, networks, and environment variables. No Docker daemon needed.",
            tip: "Mention: 'We switched from Docker to Podman for rootless security with zero compose file changes.'"
          }
        ]
      },
      architecture: {
        intro: "Podman's fork-exec model: every 'podman run' creates a direct OS process. Containers communicate via CNI plugins inside user namespaces. No daemon bottleneck exists.",
        html: `
        <div class="arch-node highlight"><i class="fas fa-terminal"></i> <h6>User Shell (Bash/ZSH)</h6><span>Issues 'podman run' commands directly</span></div>
        <div class="arch-connector-line vertical"><span class="arch-arrow-label">Fork-exec (No Daemon)</span></div>
        <div class="arch-node core"><i class="fas fa-cube"></i> <h6>Podman CLI (libpod)</h6><span>OCI Runtime Interface Layer</span></div>
        <div class="arch-connector-line vertical bidirectional"></div>
        <div class="arch-group">
          <span class="arch-group-title">Container Runtime Layer (User Namespace)</span>
          <div class="arch-node"><i class="fas fa-box"></i> <h6>Container A (rootless)</h6><span>runc / crun OCI process</span></div>
          <div class="arch-node"><i class="fas fa-box"></i> <h6>Container B (rootless)</h6><span>runc / crun OCI process</span></div>
        </div>
        <div class="arch-connector-line vertical"></div>
        <div class="arch-group">
          <span class="arch-group-title">Storage and Networking</span>
          <div class="arch-node"><i class="fas fa-database"></i> <h6>Overlay Filesystem</h6><span>Container Image Layers</span></div>
          <div class="arch-node"><i class="fas fa-network-wired"></i> <h6>CNI Network Plugin</h6><span>slirp4netns (Rootless NAT)</span></div>
        </div>
        `,
        details: {
          title: "Podman Fork-exec Architecture Breakdown",
          components: [
            { name: "libpod Library", desc: "The core Podman library that manages the container lifecycle, image pulls, and network setup without a daemon." },
            { name: "runc / crun Runtime", desc: "OCI-compliant low-level container runtime that actually starts the isolated process on the Linux kernel." },
            { name: "User Namespace Remapping", desc: "Maps container root (UID 0) to a non-privileged UID on the host, enforcing rootless security boundaries." },
            { name: "slirp4netns", desc: "Provides user-space networking for rootless containers without requiring privileged kernel network access." },
            { name: "Conmon (Container Monitor)", desc: "A lightweight monitor process watching each container, capturing stdio and reporting exit codes to Podman." }
          ]
        }
      },
      workflow: {
        intro: "Podman lifecycle: pull a rootless image, build from Dockerfile, compose multi-container apps, and generate systemd services for auto-start.",
        steps: [
          { num: 1, title: "Pull Base Image", desc: "Run 'podman pull nginx:alpine' — no daemon needed. Uses overlay storage directly on host." },
          { num: 2, title: "Build Container Image", desc: "Write a Containerfile (Dockerfile-compatible) and run 'podman build -t myapp:v1 .'." },
          { num: 3, title: "Run Rootless Container", desc: "Start with 'podman run -d -p 8080:80 myapp:v1' — no sudo or root required." },
          { num: 4, title: "Create a Pod", desc: "Group containers in a pod: 'podman pod create --name web-pod' then add containers to it." },
          { num: 5, title: "Generate Systemd Unit", desc: "Auto-start on boot: 'podman generate systemd --name myapp --files --new'." },
          { num: 6, title: "Export Kubernetes YAML", desc: "Generate K8s YAML from running pod: 'podman generate kube web-pod > pod.yaml'." }
        ]
      },
      scenarios: [
        {
          id: "podman_rootless_permission",
          category: "security",
          name: "Rootless Container Volume Permission Denied",
          cmd: "podman unshare ls -la /home/nikhil/data\npodman run -v /home/nikhil/data:/app/data:Z myapp:v1\npodman unshare chown -R 1000:1000 /home/nikhil/data",
          explanation: "Rootless Podman remaps UIDs inside the container. When mounting host directories, the container UID may not match the host directory owner. The ':Z' SELinux label flag and 'podman unshare' fix ownership.",
          output: [
            { type: "prompt", val: "nikhil@ops-center:~$ podman run -v /home/nikhil/data:/app/data myapp:v1" },
            { type: "error", val: "Error: mount /home/nikhil/data:/app/data, permission denied" },
            { type: "prompt", val: "nikhil@ops-center:~$ podman run -v /home/nikhil/data:/app/data:Z myapp:v1" },
            { type: "success", val: "\u2714 Container started. SELinux :Z label applied — volume mounted successfully." },
            { type: "info", val: "Fix: Use ':Z' suffix for SELinux relabeling or 'podman unshare chown' to fix UID mappings." }
          ]
        },
        {
          id: "podman_systemd_fail",
          category: "system",
          name: "Podman Systemd Service Not Starting on Boot",
          cmd: "systemctl --user status container-myapp.service\njournalctl --user -xe -u container-myapp.service\nloginctl enable-linger nikhil",
          explanation: "Podman-generated systemd services fail if the image was removed or if lingering is disabled — user session ends on logout, killing all user services. Enable lingering to persist services.",
          output: [
            { type: "prompt", val: "nikhil@ops-center:~$ systemctl --user status container-myapp.service" },
            { type: "log", val: "Active: failed (Result: exit-code) since Mon 2026-06-29" },
            { type: "error", val: "\u2716 Service failed: podman: image 'myapp:v1' not found locally." },
            { type: "prompt", val: "nikhil@ops-center:~$ loginctl enable-linger nikhil" },
            { type: "success", val: "\u2714 Lingering enabled. User services will persist after logout. Pull image and restart." },
            { type: "info", val: "Fix: Enable lingering with loginctl and ensure the image is pulled before service start." }
          ]
        },
        {
          id: "podman_network_isolate",
          category: "network",
          name: "Container Cannot Reach External Network",
          cmd: "podman network ls\npodman inspect mycontainer --format '{{.NetworkSettings}}'\npodman run --network=slirp4netns:allow_host_loopback=true myapp:v1 curl -s https://google.com",
          explanation: "Rootless Podman uses slirp4netns for external networking. If containers cannot reach the internet, the network mode may be missing or slirp4netns is not installed on the host.",
          output: [
            { type: "prompt", val: "nikhil@ops-center:~$ podman run myapp:v1 curl -s https://google.com" },
            { type: "error", val: "curl: (6) Could not resolve host: google.com" },
            { type: "prompt", val: "nikhil@ops-center:~$ podman run --network=slirp4netns:allow_host_loopback=true myapp:v1 curl -s https://google.com" },
            { type: "success", val: "\u2714 Network connectivity restored via slirp4netns user-mode networking." },
            { type: "info", val: "Fix: Specify '--network=slirp4netns' explicitly or verify /etc/resolv.conf inside container." }
          ]
        }
      ],
      commands: [
        { cmd: "podman pull nginx:alpine", desc: "Pull an OCI image from Docker Hub registry without root.", category: "Images" },
        { cmd: "podman build -t myapp:v1 .", desc: "Build a container image from a Dockerfile/Containerfile.", category: "Images" },
        { cmd: "podman run -d -p 8080:80 --name web nginx:alpine", desc: "Run a container in detached mode with port binding.", category: "Containers" },
        { cmd: "podman ps -a", desc: "List all running and stopped containers.", category: "Containers" },
        { cmd: "podman exec -it web sh", desc: "Open an interactive shell inside a running container.", category: "Containers" },
        { cmd: "podman logs -f web", desc: "Stream live stdout/stderr logs from a container.", category: "Containers" },
        { cmd: "podman pod create --name mypod -p 8080:80", desc: "Create a pod grouping multiple containers with shared network.", category: "Pods" },
        { cmd: "podman generate systemd --name web --files --new", desc: "Generate a systemd unit file to auto-start a container on boot.", category: "Systemd" },
        { cmd: "systemctl --user enable --now container-web.service", desc: "Enable and start a Podman container as a user systemd service.", category: "Systemd" },
        { cmd: "podman generate kube mypod > pod.yaml", desc: "Export a running Podman pod to Kubernetes YAML format.", category: "Kubernetes" },
        { cmd: "podman system prune -a --volumes", desc: "Remove all stopped containers, unused images, and orphan volumes.", category: "Cleanup" },
        { cmd: "podman unshare chown -R 1000:1000 /data", desc: "Fix volume UID ownership inside the rootless user namespace.", category: "Security" }
      ]
    };

    /* ================================================================
       OPENSHIFT — Full Playbook Data
    ================================================================ */
    window.devopsToolData.openshift = {
      title: "Red Hat OpenShift",
      subtitle: "Enterprise Kubernetes Platform (OCP)",
      category: "Orchestration",
      iconClass: "fas fa-dharmachakra",
      overview: {
        desc: "OpenShift Container Platform (OCP) is Red Hat's enterprise Kubernetes distribution. It adds a full developer portal, automated builds (BuildConfig), an integrated image registry, Routes (instead of plain Ingress), strict Security Context Constraints (SCCs), Operators for automated Day-2 operations, and enterprise support on top of upstream Kubernetes.",
        metrics: [
          { label: "CLI Tool", val: "oc (wraps kubectl)" },
          { label: "Routing", val: "Routes (HAProxy)" },
          { label: "Access Control", val: "SCCs (Security Constraints)" },
          { label: "Build System", val: "BuildConfig / S2I" },
          { label: "Operators", val: "OLM (Operator Lifecycle Mgr)" },
          { label: "Registry", val: "Integrated Image Registry" }
        ],
        concepts: [
          { title: "Projects (Namespaces++)", desc: "OpenShift Projects are Kubernetes Namespaces with extra metadata — they auto-create RBAC roles, network policies, and resource quotas on project creation.", icon: "fas fa-folder" },
          { title: "Routes (vs K8s Ingress)", desc: "OpenShift Routes expose services externally via HAProxy router. They support TLS passthrough, edge, and reencrypt termination — simpler than writing raw Ingress YAML.", icon: "fas fa-route" },
          { title: "Security Context Constraints", desc: "OpenShift's pod security admission model. SCCs define what privileges pods can request (root, hostPID, capabilities). Pods violating SCCs are rejected at the API admission gate.", icon: "fas fa-shield-alt" },
          { title: "BuildConfig and S2I", desc: "Source-to-Image (S2I) builds container images directly from source code inside the cluster. No external CI server needed for basic automated builds.", icon: "fas fa-code" },
          { title: "Operators and OLM", desc: "Operators automate complex stateful application management using custom controllers. OLM manages installation, upgrade, and dependency resolution of operators from OperatorHub.", icon: "fas fa-robot" },
          { title: "ImageStreams", desc: "OpenShift tracks image versions in ImageStreams. When a new image is pushed to the registry, downstream builds and deployments can trigger automatically.", icon: "fas fa-layer-group" }
        ],
        interviewPrep: [
          {
            q: "What is the difference between OpenShift Routes and Kubernetes Ingress?",
            a: "Kubernetes Ingress is a generic standard requiring an external Ingress Controller plugin (NGINX, Traefik). OpenShift Routes are a native resource backed by an embedded HAProxy router — zero plugin setup. Routes also support richer TLS modes (edge, passthrough, reencrypt) without extra annotations.",
            tip: "Say: 'Routes are cluster-native — no Ingress Controller deployment required in OpenShift.'"
          },
          {
            q: "What are Security Context Constraints (SCCs) and why do pods fail because of them?",
            a: "SCCs are OpenShift's admission policy for pod security. By default, OpenShift blocks pods from running as root or requesting extra Linux capabilities. Pods fail with 'unable to validate against any SCC' if they request privileges not allowed by their binding. Fix by assigning 'anyuid' SCC: 'oc adm policy add-scc-to-user anyuid -z default'.",
            tip: "Never assign 'privileged' SCC to all service accounts — always scope to specific service accounts."
          },
          {
            q: "What is the Operator pattern and how does OLM manage operators?",
            a: "An Operator is a Kubernetes controller that encodes human operational knowledge (install, backup, upgrade, scale) into automated controller logic. OLM provides a catalog, handles installation, manages upgrades, and resolves dependencies — like an app store for cluster operations.",
            tip: "Mention specific operators: 'We use the Prometheus Operator and EDB PostgreSQL Operator in production.'"
          }
        ]
      },
      architecture: {
        intro: "OpenShift's control plane sits above standard Kubernetes. External traffic hits the integrated HAProxy Router, routes to cluster services, and pods run under strict SCC constraints.",
        html: `
        <div class="arch-node highlight"><i class="fas fa-globe"></i> <h6>External Traffic</h6><span>Users and API Clients</span></div>
        <div class="arch-connector-line vertical"></div>
        <div class="arch-node core"><i class="fas fa-route"></i> <h6>OpenShift Router (HAProxy)</h6><span>Routes — TLS Termination and Load Balancing</span></div>
        <div class="arch-connector-line vertical bidirectional"><span class="arch-arrow-label">Route to Service Match</span></div>
        <div class="arch-group">
          <span class="arch-group-title">OpenShift Project (Namespace + RBAC + Quotas)</span>
          <div class="arch-node"><i class="fas fa-cube"></i> <h6>Pod A (SCC: restricted)</h6><span>App Container — Non-Root Enforced</span></div>
          <div class="arch-node"><i class="fas fa-cube"></i> <h6>Pod B (SCC: anyuid)</h6><span>Legacy Container — Root Allowed</span></div>
        </div>
        <div class="arch-connector-line vertical"></div>
        <div class="arch-group">
          <span class="arch-group-title">Platform Services Layer</span>
          <div class="arch-node highlight"><i class="fas fa-database"></i> <h6>etcd Datastore</h6><span>Cluster State Storage</span></div>
          <div class="arch-node highlight"><i class="fas fa-box"></i> <h6>Integrated Registry</h6><span>Internal Image Repository</span></div>
          <div class="arch-node"><i class="fas fa-robot"></i> <h6>Operators (OLM)</h6><span>Day-2 Automation Controllers</span></div>
        </div>
        `,
        details: {
          title: "OpenShift Container Platform Architecture",
          components: [
            { name: "HAProxy Router", desc: "Built-in ingress router exposing Route resources. Handles HTTP/HTTPS routing, TLS termination, and traffic shaping across projects." },
            { name: "OpenShift API Server", desc: "Extends the Kubernetes API with OpenShift-native resources like Routes, BuildConfigs, DeploymentConfigs, and ImageStreams." },
            { name: "Integrated Container Registry", desc: "Internal registry for storing BuildConfig output images and ImageStream tags — no external registry required." },
            { name: "Admission Controllers + SCCs", desc: "Block non-compliant pods at admission time before they are ever scheduled to any node." },
            { name: "OLM (Operator Lifecycle Manager)", desc: "Manages operator installation, dependency resolution, and version upgrades from the OperatorHub catalog." }
          ]
        }
      },
      workflow: {
        intro: "OpenShift workflow: create a Project, define SCCs, deploy from BuildConfig or external registry, expose via Route, configure TLS, and monitor.",
        steps: [
          { num: 1, title: "Login and Create Project", desc: "oc login to the cluster API server, then 'oc new-project myapp-prod' to initialize a namespace." },
          { num: 2, title: "Configure SCC Policies", desc: "Assign required SCC to service accounts: 'oc adm policy add-scc-to-user anyuid -z default'." },
          { num: 3, title: "Deploy Application", desc: "Use 'oc new-app' with S2I source builds or provide an existing image from an external registry." },
          { num: 4, title: "Expose as Route", desc: "Create a Route: 'oc expose svc/myapp --hostname=myapp.apps.cluster.example.com'." },
          { num: 5, title: "Configure TLS", desc: "Add edge TLS termination to the route for HTTPS with auto-managed cluster certificates." },
          { num: 6, title: "Monitor and Scale", desc: "Set HPA autoscalers and view metrics in the built-in OpenShift web console monitoring dashboards." }
        ]
      },
      scenarios: [
        {
          id: "ocp_scc_violation",
          category: "security",
          name: "Pod Fails — SCC Security Constraint Violation",
          cmd: "oc get events -n myapp | grep -i scc\noc describe pod myapp-xyz -n myapp | grep -A 5 SCC\noc adm policy add-scc-to-user anyuid -z default -n myapp",
          explanation: "OpenShift rejects pods requesting root access or extra capabilities by default. The SCC admission controller blocks deployment. You must assign a permissive SCC to the pod's service account.",
          output: [
            { type: "prompt", val: "nikhil@ops-center:~$ oc get events -n myapp | grep -i scc" },
            { type: "error", val: "Error: unable to validate against any security context constraint: spec.containers[0].runAsUser: must be in ranges [1000620000, 1000629999]" },
            { type: "prompt", val: "nikhil@ops-center:~$ oc adm policy add-scc-to-user anyuid -z default -n myapp" },
            { type: "success", val: "\u2714 scc 'anyuid' added to: z/default. Pod can now run as UID 0." },
            { type: "info", val: "Fix: Assign 'anyuid' SCC to the specific service account. Avoid 'privileged' unless absolutely necessary." }
          ]
        },
        {
          id: "ocp_route_503",
          category: "network",
          name: "Route Returns 503 Service Unavailable",
          cmd: "oc get route myapp -n myapp\noc get endpoints myapp -n myapp\noc get pods -n myapp -o wide",
          explanation: "A Route 503 error means the HAProxy router found no healthy backend pods. Service Endpoints must be populated and pods must be running in a Ready state.",
          output: [
            { type: "prompt", val: "nikhil@ops-center:~$ oc get endpoints myapp -n myapp" },
            { type: "log", val: "NAME    ENDPOINTS   AGE\nmyapp   <none>      5m" },
            { type: "error", val: "\u2716 Service 'myapp' has NO endpoints — all pods down or label selectors are mismatched." },
            { type: "prompt", val: "nikhil@ops-center:~$ oc get pods -n myapp -o wide" },
            { type: "log", val: "NAME           READY   STATUS             RESTARTS   AGE\nmyapp-xyz      0/1     CrashLoopBackOff   5          4m" },
            { type: "info", val: "Fix: Debug the crashing pod with 'oc logs myapp-xyz --previous' and resolve the startup error." }
          ]
        },
        {
          id: "ocp_image_pull",
          category: "system",
          name: "ImagePullBackOff — Registry Authentication Error",
          cmd: "oc describe pod myapp-xyz -n myapp | grep -A 10 Events\noc create secret docker-registry regcred --docker-server=quay.io --docker-username=nikhil --docker-password=TOKEN -n myapp\noc secrets link default regcred --for=pull -n myapp",
          explanation: "OpenShift pods fail to pull images from private registries when pull secrets are missing or expired. Create a docker-registry secret and link it to the service account.",
          output: [
            { type: "prompt", val: "nikhil@ops-center:~$ oc describe pod myapp-xyz | grep Events -A 5" },
            { type: "log", val: "Events:\n  Failed to pull image 'quay.io/nikhil/myapp:v2': unauthorized: authentication required" },
            { type: "error", val: "\u2716 ImagePullBackOff: Registry credentials are missing or expired." },
            { type: "prompt", val: "nikhil@ops-center:~$ oc secrets link default regcred --for=pull -n myapp" },
            { type: "success", val: "\u2714 Pull secret 'regcred' linked to 'default' service account. Retry pod deployment." },
            { type: "info", val: "Fix: Create a docker-registry secret and link it to the pod's service account." }
          ]
        }
      ],
      commands: [
        { cmd: "oc login --server=https://api.cluster.example.com", desc: "Authenticate to an OpenShift cluster API endpoint.", category: "Auth" },
        { cmd: "oc new-project myapp-prod", desc: "Create a new OpenShift project (namespace with RBAC defaults).", category: "Projects" },
        { cmd: "oc new-app --image=nginx:alpine --name=web", desc: "Deploy an application from an existing container image.", category: "Deploy" },
        { cmd: "oc expose svc/web --hostname=web.apps.cluster.com", desc: "Create an HTTP Route to expose a service externally via HAProxy.", category: "Routes" },
        { cmd: "oc get pods -n myapp -o wide", desc: "List all pods with node placement info in a project namespace.", category: "View" },
        { cmd: "oc logs -f pod/myapp-xyz", desc: "Stream container logs from a specific pod in real-time.", category: "Debug" },
        { cmd: "oc describe pod myapp-xyz", desc: "Show full events and resource details for a pod.", category: "Debug" },
        { cmd: "oc adm policy add-scc-to-user anyuid -z default", desc: "Assign 'anyuid' SCC to allow pods to run as any user ID.", category: "Security" },
        { cmd: "oc rollout restart deployment/myapp", desc: "Trigger a rolling restart of all pods in a deployment.", category: "Deploy" },
        { cmd: "oc scale deployment/myapp --replicas=3", desc: "Manually scale a deployment to 3 pod replicas.", category: "Scaling" },
        { cmd: "oc get route -n myapp", desc: "List all exposed Routes and their hostnames in a project.", category: "Routes" },
        { cmd: "oc whoami --show-server", desc: "Show the currently logged-in user and connected cluster API URL.", category: "Auth" }
      ]
    };

    console.log('[DevOps Portfolio] Podman & OpenShift tool data injected successfully.');
  }

  // Boot: run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectToolData);
  } else {
    injectToolData();
  }
})();
