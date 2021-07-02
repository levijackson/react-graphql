interface Repo {
  name: string,
  description: string,
  id: string,
  url: string,
  viewerSubscription: "SUBSCRIBED" | "UNSUBSCRIBED"
}

export default Repo;