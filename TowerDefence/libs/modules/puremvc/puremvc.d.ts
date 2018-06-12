declare module puremvc {
    /**
     * The interface definition for a PureMVC <code>Notifier</code>.
     *
     * <code>MacroCommand</code>, <code>SimpleCommand</code>, <code>Mediator</code> and
     * <code>Proxy</code> all have a need to send <code>Notifications</code>.
     *
     * The <code>INotifier</code> interface provides a common method called
     * <code>sendNotification</code> that relieves implementation code of the necessity to actually
     * construct <code>Notification</code>s.
     *
     * The <code>INotifier</code> interface, which all of the above mentioned classes extend,
     * provides an initialized reference to the <code>Facade</code> singleton, which is required by
     * the convenience method <code>sendNotification</code>	for sending <code>Notifications</code>,
     * but it also eases implementation as these classes have frequent <code>Facade</code>
     * interactions and usually require access to the facade anyway.
     */
    interface INotifier {
        /**
         * Create and send a <code>Notification</code>.
         *
         * Keeps us from having to construct new <code>Notification</code> instances in our
         * implementation code.
         *
         * @param name
         * 		The name of the notification to send.
         *
         * @param body
         * 		The body of the notification (optional).
         *
         * @param type
         * 		The type of the notification (optional).
         */
        sendNotification(name: string, body?: any, type?: string): void;
        /**
         * Initialize this INotifier instance.
         *
         * This is how a Notifier gets its multitonKey. Calls to sendNotification or to access the
         * facade will fail until after this method has been called.
         *
         * @param key
         *		The multiton key for this <code>INotifier</code> to use.
         */
        initializeNotifier(key: string): void;
    }
}
declare module puremvc {
    /**
     * The interface definition for a PureMVC notification.
     *
     * PureMVC does not rely upon underlying event models such as the one provided in JavaScript DOM API,
     * and TypeScript does not have an inherent event model.
     *
     * The Observer pattern as implemented within PureMVC exists to support event-driven
     * communication between the application and the actors of the MVC triad (Model, View and
     * Controller).
     *
     * Notifications are not meant to be a replacement for Events in Javascript.
     * Generally, <code>IMediator</code> implementors place event listeners on their view components,
     * which they then handle in the usual way. This may lead to the broadcast of
     * <code>INotification</code>s to trigger <code>ICommand</code>s or to communicate with other
     * <code>IMediators</code>. <code>IProxy</code> and <code>ICommand</code> instances communicate
     * with each other and <code>IMediator</code>s by broadcasting <code>INotification</code>s.
     *
     * A key difference between JavaScript <code>Event</code>s and PureMVC
     * <code>INotification</code>s is that <code>Event</code>s follow the 'Chain of Responsibility'
     * pattern, 'bubbling' up the display hierarchy until some parent component handles the
     * <code>Event</code>, while PureMVC <code>INotification</code>s follow a 'Publish/Subscribe'
     * pattern. PureMVC classes need not be related to each other in a parent/child relationship in
     * order to communicate with one another using <code>INotification</code>s.
     */
    interface INotification {
        /**
         * Get the name of the <code>Notification</code> instance.
         *
         * @return
         *		The name of the <code>Notification</code> instance.
         */
        getName(): string;
        /**
         * Set the body of the <code>INotification</code>.
         *
         * @param body
         * 		The body of the notification instance.
         */
        setBody(body: any): void;
        /**
         * Get the body of the <code>INotification</code>.
         *
         * @return
         *		The body object of the <code>INotification</code>.
         */
        getBody(): any;
        /**
         * Set the type of the <code>INotification</code>.
         *
         * @param type
         * 		The type identifier for the notification.
         */
        setType(type: string): void;
        /**
         * Get the type of the <code>INotification</code>.
         *
         * @return
         *		The type of the <code>INotification</code>.
         */
        getType(): string;
        /**
         * Get a textual representation of the <code>Notification</code> instance.
         *
         * @return
         * 		The textual representation of the <code>Notification</code>	instance.
         */
        toString(): string;
    }
}
declare module puremvc {
    /**
     * The interface definition for a PureMVC Command.
     */
    interface ICommand extends INotifier {
        /**
         * Fulfill the use-case initiated by the given <code>INotification</code>.
         *
         * In the Command Pattern, an application use-case typically begins with some user action,
         * which results in an <code>INotification</code> being broadcast, which is handled by
         * business logic in the <code>execute</code> method of an <code>ICommand</code>.
         *
         * @param notification
         * 		The <code>INotification</code> to handle.
         */
        execute(notification: INotification): void;
    }
}
declare module puremvc {
    /**
     * The interface definition for a PureMVC Controller.
     *
     * In PureMVC, an <code>IController</code> implementor follows the 'Command and Controller'
     * strategy, and assumes these responsibilities:
     * <UL>
     * <LI>Remembering which <code>ICommand</code>s are intended to handle which
     * <code>INotification</code>s.
     * <LI>Registering itself as an <code>IObserver</code> with the <code>View</code> for each
     * <code>INotification</code> that it has an <code>ICommand</code> mapping for.
     * <LI>Creating a new instance of the proper <code>ICommand</code> to handle a given
     * <code>INotification</code> when notified by the <code>View</code>.
     * <LI>Calling the <code>ICommand</code>'s <code>execute</code> method, passing in the
     * <code>INotification</code>.
     *
     * Your application must register <code>ICommand</code>s with the <code>Controller</code>.
     *
     * The simplest way is to subclass </code>Facade</code>, and use its
     * <code>initializeController</code> method to add your registrations.
     */
    interface IController {
        /**
         * If an <code>ICommand</code> has previously been registered to handle the given
         * <code>INotification</code>, then it is executed.
         *
         * @param notification
         * 		The <code>INotification</code> the command will receive as parameter.
         */
        executeCommand(notification: INotification): void;
        /**
         * Register a particular <code>ICommand</code> class as the handler for a particular
         * <code>INotification</code>.
         *
         * If an <code>ICommand</code> has already been registered to handle
         * <code>INotification</code>s with this name, it is no longer used, the new
         * <code>ICommand</code> is used instead.
         *
         * The <code>Observer</code> for the new <code>ICommand</code> is only created if this the
         * first time an <code>ICommand</code> has been registered for this
         * <code>Notification</code> name.
         *
         * @param notificationName
         * 		The name of the <code>INotification</code>.
         *
         * @param commandClassRef
         * 		The constructor of the <code>ICommand</code> implementor classes.
         */
        registerCommand(notificationName: string, commandClassRef: Function): void;
        /**
         * Check if an <code>ICommand</code> is registered for a given <code>Notification</code>.
         *
         * @param notificationName
         * 		Name of the <code>Notification</code> to check wheter an <code>ICommand</code> is
         * 		registered for.
         *
         * @return
         * 		An <code>ICommand</code> is currently registered for the given
         *		<code>notificationName</code>.
         */
        hasCommand(notificationName: string): boolean;
        /**
         * Remove a previously registered <code>ICommand</code> to <code>INotification</code>
         * mapping.
         *
         * @param notificationName
         * 		The name of the <code>INotification</code> to remove the <code>ICommand</code>
         * 		mapping for.
         */
        removeCommand(notificationName: string): void;
    }
}
declare module puremvc {
    /**
     * The interface definition for a PureMVC Mediator.
     *
     * In PureMVC, <code>IMediator</code> implementors assume these responsibilities:
     * <UL>
     * <LI>Implement a common method which returns a list of all <code>INotification</code>s
     * the <code>IMediator</code> has interest in.
     * <LI>Implement a notification callback method.
     * <LI>Implement methods that are called when the IMediator is registered or removed from the View.
     *
     * Additionally, <code>IMediator</code>s typically:
     * <UL>
     * <LI>Act as an intermediary between one or more view components such as text boxes or
     * list controls, maintaining references and coordinating their behavior.
     * <LI>In a PureMVC application, this the place where event listeners are added to view
     * components, and their handlers implemented.
     * <LI>Respond to and generate <code>INotifications</code>, interacting with of the rest of the
     * PureMVC application.
     *
     * When an <code>IMediator</code> is registered with the <code>IView</code>,
     * the <code>IView</code> will call the <code>IMediator</code>'s
     * <code>listNotificationInterests</code> method. The <code>IMediator</code> will
     * return a list of <code>INotification</code> names which
     * it wishes to be notified about.
     *
     * The <code>IView</code> will then create an <code>Observer</code> object
     * encapsulating that <code>IMediator</code>'s (<code>handleNotification</code>) method
     * and register it as an Observer for each <code>INotification</code> name returned by
     * <code>listNotificationInterests</code>.
     */
    interface IMediator extends INotifier {
        /**
         * Get the <code>IMediator</code> instance name
         *
         * @return
         * 		The <code>IMediator</code> instance name
         */
        getMediatorName(): string;
        /**
         * Get the <code>Mediator</code>'s view component.
         *
         * Additionally, an implicit getter will usually be defined in the subclass that casts the
         * view object to a type, like this:
         *
         * <code>
         *		getMenu: function
         *		{
         *			return this.viewComponent;
         *		}
         * </code>
         *
         * @return
         * 		The <code>Mediator</code>'s view component.
         */
        getViewComponent(): any;
        /**
         * Set the <code>IMediator</code>'s view component.
         *
         * @param viewComponent
         * 		The default view component to set for this <code>Mediator</code>.
         */
        setViewComponent(viewComponent: any): void;
        /**
         * List the <code>INotification</code> names this <code>IMediator</code> is interested in
         * being notified of.
         *
         * @return
         * 		The list of notifications names in which is interested the <code>Mediator</code>.
         */
        listNotificationInterests(): string[];
        /**
         * Handle <code>INotification</code>s.
         *
         *
         * Typically this will be handled in a switch statement, with one 'case' entry per
         * <code>INotification</code> the <code>Mediator</code> is interested in.
         *
         * @param notification
         * 		The notification instance to be handled.
         */
        handleNotification(notification: INotification): void;
        /**
         * Called by the View when the Mediator is registered. This method has to be overridden
         * by the subclass to know when the instance is registered.
         */
        onRegister(): void;
        /**
         * Called by the View when the Mediator is removed. This method has to be overridden
         * by the subclass to know when the instance is removed.
         */
        onRemove(): void;
    }
}
declare module puremvc {
    /**
     * The interface definition for a PureMVC Proxy.
     *
     * In PureMVC, <code>IProxy</code> implementors assume these responsibilities:
     * <UL>
     * <LI>Implement a common method which returns the name of the Proxy.
     * <LI>Provide methods for setting and getting the data object.
     *
     * Additionally, <code>IProxy</code>s typically:
     * <UL>
     * <LI>Maintain references to one or more pieces of model data.
     * <LI>Provide methods for manipulating that data.
     * <LI>Generate <code>INotifications</code> when their model data changes.
     * <LI>Expose their name as a <code>constant</code> called <code>NAME</code>, if they are not
     * instantiated multiple times.
     * <LI>Encapsulate interaction with local or remote services used to fetch and persist model
     * data.
     */
    interface IProxy extends INotifier {
        /**
         * Get the name of the <code>IProxy></code> instance.
         *
         * @return
         * 		The name of the <code>IProxy></code> instance.
         */
        getProxyName(): string;
        /**
         * Set the data of the <code>IProxy></code> instance.
         *
         * @param data
         * 		The data to set for the <code>IProxy></code> instance.
         */
        setData(data: any): void;
        /**
         * Get the data of the <code>IProxy></code> instance.
         *
         * @return
         * 		The data held in the <code>IProxy</code> instance.
         */
        getData(): any;
        /**
         * Called by the Model when the <code>IProxy</code> is registered. This method has to be
         * overridden by the subclass to know when the instance is registered.
         */
        onRegister(): void;
        /**
         * Called by the Model when the <code>IProxy</code> is removed. This method has to be
         * overridden by the subclass to know when the instance is removed.
         */
        onRemove(): void;
    }
}
declare module puremvc {
    /**
     * The interface definition for a PureMVC Facade.
     *
     *
     * The Facade Pattern suggests providing a single class to act as a central point of
     * communication for a subsystem.
     *
     *
     * In PureMVC, the Facade acts as an interface between the core MVC actors (Model, View,
     * Controller) and the rest of your application.
     */
    interface IFacade extends INotifier {
        /**
         * Register an <code>ICommand</code> with the <code>IController</code> associating it to a
         * <code>INotification</code> name.
         *
         * @param notificationName
         *		The name of the <code>INotification</code> to associate the <code>ICommand</code>
         *		with.
         *
         * @param commandClassRef
         * 		A reference to the constructor of the <code>ICommand</code>.
         */
        registerCommand(notificationName: string, commandClassRef: Function): void;
        /**
         * Remove a previously registered <code>ICommand</code> to <code>INotification</code>
         * mapping from the <code>Controller</code>.
         *
         * @param notificationName
         *		The name of the <code>INotification</code> to remove the <code>ICommand</code>
         *		mapping for.
         */
        removeCommand(notificationName: string): void;
        /**
         * Check if an <code>ICommand</code> is registered for a given <code>Notification</code>.
         *
         * @param notificationName
         * 		The name of the <code>INotification</code> to verify for the existence of a
         * 		<code>ICommand</code> mapping for.
         *
         * @return
         * 		A <code>Command</code> is currently registered for the given
         *		<code>notificationName</code>.
         */
        hasCommand(notificationName: string): boolean;
        /**
         * Register an <code>IProxy</code> with the <code>Model</code> by name.
         *
         * @param proxy
         *		The <code>IProxy</code> to be registered with the <code>Model</code>.
         */
        registerProxy(proxy: IProxy): void;
        /**
         * Retrieve an <code>IProxy</code> from the <code>Model</code> by name.
         *
         * @param proxyName
         * 		The name of the <code>IProxy</code> to be retrieved.
         *
         * @return
         * 		The <code>IProxy</code> previously registered with the given <code>proxyName</code>.
         */
        retrieveProxy(proxyName: string): IProxy;
        /**
         * Remove an <code>IProxy</code> from the <code>Model</code> by name.
         *
         * @param proxyName
         *		The <code>IProxy</code> to remove from the <code>Model</code>.
         *
         * @return
         *		The <code>IProxy</code> that was removed from the <code>Model</code>
         */
        removeProxy(proxyName: string): IProxy;
        /**
         * Check if a <code>Proxy</code> is registered.
         *
         * @param proxyName
         * 		The <code>IProxy</code> to verify the existence of a registration with the
         *		<code>IModel</code>.
         *
         * @return
         * 		A <code>Proxy</code> is currently registered with the given	<code>proxyName</code>.
         */
        hasProxy(proxyName: string): boolean;
        /**
         * Register a <code>IMediator</code> with the <code>IView</code>.
         *
         * @param mediator
                A reference to the <code>IMediator</code>.
         */
        registerMediator(mediator: IMediator): void;
        /**
         * Retrieve an <code>IMediator</code> from the <code>IView</code>.
         *
         * @param mediatorName
         * 		The name of the registered <code>Mediator</code> to retrieve.
         *
         * @return
         *		The <code>IMediator</code> previously registered with the given
         *		<code>mediatorName</code>.
         */
        retrieveMediator(mediatorName: string): IMediator;
        /**
         * Remove an <code>IMediator</code> from the <code>IView</code>.
         *
         * @param mediatorName
         * 		Name of the <code>IMediator</code> to be removed.
         *
         * @return
         *		The <code>IMediator</code> that was removed from the <code>IView</code>
         */
        removeMediator(mediatorName: string): IMediator;
        /**
         * Check if a Mediator is registered or not
         *
         * @param mediatorName
         * 		The name of the <code>IMediator</code> to verify the existence of a registration
         *		for.
         *
         * @return
         * 		An <code>IMediator</code> is registered with the given <code>mediatorName</code>.
         */
        hasMediator(mediatorName: string): boolean;
        /**
         * Notify the <code>IObservers</code> for a particular <code>INotification</code>.
         *
         * This method is left public mostly for backward compatibility, and to allow you to send
         * custom notification classes using the facade.
         *
         * Usually you should just call sendNotification and pass the parameters, never having to
         * construct the notification yourself.
         *
         * @param notification
         * 		The <code>INotification</code> to have the <code>IView</code> notify
         *		<code>IObserver</code>s	of.
         */
        notifyObservers(notification: INotification): void;
    }
}
declare module puremvc {
    /**
     * The interface definition for a PureMVC Model.
     *
     * In PureMVC, the <code>IModel</code> class provides access to model objects
     * <code>Proxie</code>s by named lookup.
     *
     * The <code>Model</code> assumes these responsibilities:
     * <UL>
     * <LI>Maintain a cache of <code>IProxy</code> instances.
     * <LI>Provide methods for registering, retrieving, and removing <code>Proxy</code> instances.
     *
     * Your application must register <code>IProxy</code> instances with the <code>Model</code>.
     * Typically, you use an <code>ICommand</code> to create and register <code>Proxy</code> instances
     * once the <code>Facade</code> has initialized the Core actors.
     */
    interface IModel {
        /**
         * Register an <code>IProxy</code> with the <code>Model</code>.
         *
         * @param proxy
         *		An <code>IProxy</code> to be held by the <code>Model</code>.
         */
        registerProxy(proxy: IProxy): void;
        /**
         * Remove an <code>IProxy</code> from the <code>Model</code>.
         *
         * @param proxyName
         *		The name of the <code>Proxy</code> instance to be removed.
         *
         * @return
         *		The <code>IProxy</code> that was removed from the <code>Model</code> or an
         *		explicit <code>null</null> if the <code>IProxy</code> didn't exist.
         */
        removeProxy(proxyName: string): IProxy;
        /**
         * Retrieve an <code>IProxy</code> from the <code>Model</code>.
         *
         * @param proxyName
         *		 The <code>IProxy</code> name to retrieve from the <code>Model</code>.
         *
         * @return
         *		The <code>IProxy</code> instance previously registered with the given
         *		<code>proxyName</code> or an explicit <code>null</code> if it doesn't exists.
         */
        retrieveProxy(proxyName: string): IProxy;
        /**
         * Check if a Proxy is registered
         *
         * @param proxyName
         *		The name of the <code>IProxy</code> to verify the existence of its registration.
         *
         * @return
         *		A Proxy is currently registered with the given <code>proxyName</code>.
         */
        hasProxy(proxyName: string): boolean;
    }
}
declare module puremvc {
    /**
     * The interface definition for a PureMVC Observer.
     *
     * In PureMVC, <code>IObserver</code> implementors assumes these responsibilities:
     * <UL>
     * <LI>Encapsulate the notification (callback) method of the interested object.
     * <LI>Encapsulate the notification context (this) of the interested object.
     * <LI>Provide methods for setting the interested object notification method and context.
     * <LI>Provide a method for notifying the interested object.
     *
     * PureMVC does not rely upon underlying event models such as the one provided in JavaScript DOM API,
     * and JavaScript does not have an inherent event model.
     *
     * The Observer Pattern as implemented within PureMVC exists to support event driven
     * communication between the application and the actors of the MVC triad (Model, View, Controller).
     *
     * An Observer is an object that encapsulates information about an interested object with a
     * notification method that should be called when an </code>INotification</code> is broadcast.
     * The Observer then acts as a proxy for notifying the interested object.
     *
     * Observers can receive <code>Notification</code>s by having their <code>notifyObserver</code>
     * method invoked, passing in an object implementing the <code>INotification</code> interface,
     * such as a subclass of <code>Notification</code>.
     */
    interface IObserver {
        /**
         * Set the notification method.
         *
         * The notification method should take one parameter of type <code>INotification</code>.
         *
         * @param notifyMethod
         * 		The notification (callback) method of the interested object.
         */
        setNotifyMethod(notifyMethod: Function): void;
        /**
        /**
         * Set the notification context.
         *
         * @param notifyContext
         * 		The notification context (this) of the interested object.
         */
        setNotifyContext(notifyContext: any): void;
        /**
         * Notify the interested object.
         *
         * @param notification
         * 		The <code>INotification</code> to pass to the interested object's notification
         * 		method.
         */
        notifyObserver(notification: INotification): void;
        /**
         * Compare an object to the notification context.
         *
         * @param object
         * 		The object to compare.
         *
         * @return
         * 		The object and the notification context are the same.
         */
        compareNotifyContext(object: any): boolean;
    }
}
declare module puremvc {
    /**
     * The interface definition for a PureMVC view.
     *
     * In PureMVC, <code>IView</code> implementors assume these responsibilities:
     *
     * In PureMVC, the <code>View</code> class assumes these responsibilities:
     * <UL>
     * <LI>Maintain a cache of <code>IMediator</code> instances.
     * <LI>Provide methods for registering, retrieving, and removing <code>IMediator</code>s.
     * <LI>Notifiying <code>IMediator</code>s when they are registered or removed.
     * <LI>Managing the <code>Observer</code> lists for each <code>INotification</code> in the
     * application.
     * <LI>Providing a method for attaching <code>IObservers</code> to an
     * <code>INotification</code>'s <code>Observer</code> list.
     * <LI>Providing a method for broadcasting an <code>INotification</code>.
     * <LI>Notifying the <code>IObserver</code>s of a given <code>INotification</code> when it
     * broadcasts.
     */
    interface IView {
        /**
         * Register an <code>IObserver</code> to be notified of <code>INotifications</code> with a
         * given name.
         *
         * @param notificationName
         * 		The name of the <code>INotifications</code> to notify this <code>IObserver</code>
         * 		of.
         *
         * @param observer
         * 		The <code>IObserver</code> to register.
         */
        registerObserver(notificationName: string, observer: IObserver): void;
        /**
         * Remove a list of <code>Observer</code>s for a given <code>notifyContext</code> from an
         * <code>Observer</code> list for a given <code>INotification</code> name.
         *
         * @param notificationName
         * 		Which <code>IObserver</code> list to remove from.
         *
         * @param notifyContext
         * 		Remove the <code>IObserver</code> with this object as its
         *		<code>notifyContext</code>.
         */
        removeObserver(notificationName: string, notifyContext: any): void;
        /**
         * Notify the <code>IObserver</code>s for a particular <code>INotification</code>.
         *
         * All previously attached <code>IObserver</code>s for this <code>INotification</code>'s
         * list are notified and are passed a reference to the <code>INotification</code> in the
         * order in which they were registered.
         *
         * @param notification
         * 		The <code>INotification</code> to notify <code>IObserver</code>s of.
         */
        notifyObservers(notification: INotification): void;
        /**
         * Register an <code>IMediator</code> instance with the <code>View</code>.
         *
         * Registers the <code>IMediator</code> so that it can be retrieved by name, and further
         * interrogates the <code>IMediator</code> for its <code>INotification</code> interests.
         *
         * If the <code>IMediator</code> returns any <code>INotification</code> names to be
         * notified about, an <code>Observer</code> is created to encapsulate the
         * <code>IMediator</code> instance's <code>handleNotification</code> method and register
         * it as an <code>Observer</code> for all <code>INotification</code>s the
         * <code>IMediator</code> is interested in.
         *
         * @param mediator
         * 		A reference to an <code>IMediator</code> implementation instance.
         */
        registerMediator(mediator: IMediator): void;
        /**
         * Retrieve an <code>IMediator</code> from the <code>View</code>.
         *
         * @param mediatorName
         * 		The name of the <code>IMediator</code> instance to retrieve.
         *
         * @return
         * 		The <code>IMediator</code> instance previously registered with the given
         *		<code>mediatorName</code> or an explicit <code>null</code> if it doesn't exists.
         */
        retrieveMediator(mediatorName: string): IMediator;
        /**
         * Remove an <code>IMediator</code> from the <code>View</code>.
         *
         * @param mediatorName
         * 		Name of the <code>IMediator</code> instance to be removed.
         *
         * @return
         *		The <code>IMediator</code> that was removed from the <code>View</code> or a
         *		strict <code>null</null> if the <code>Mediator</code> didn't exist.
         */
        removeMediator(mediatorName: string): IMediator;
        /**
         * Check if a <code>IMediator</code> is registered or not.
         *
         * @param mediatorName
         * 		The <code>IMediator</code> name to check whether it is registered.
         *
         * @return
         *		A <code>Mediator</code> is registered with the given <code>mediatorName</code>.
         */
        hasMediator(mediatorName: string): boolean;
    }
}
declare module puremvc {
    /**
     * A base <code>IObserver</code> implementation.
     *
     * In PureMVC, the <code>Observer</code> class assumes these responsibilities:
     * <UL>
     * <LI>Encapsulate the notification (callback) method of the interested object.
     * <LI>Encapsulate the notification context (this) of the interested object.
     * <LI>Provide methods for setting the interested object notification method and context.
     * <LI>Provide a method for notifying the interested object.
     *
     * PureMVC does not rely upon underlying event models such as the one provided in JavaScript DOM API,
     * and TypeScript does not have an inherent event model.
     *
     * The Observer Pattern as implemented within PureMVC exists to support event driven
     * communication between the application and the actors of the MVC triad (Model, View, Controller).
     *
     * An Observer is an object that encapsulates information about an interested object with a
     * notification method that should be called when an </code>INotification</code> is broadcast.
     * The Observer then acts as a proxy for notifying the interested object.
     *
     * Observers can receive <code>Notification</code>s by having their <code>notifyObserver</code>
     * method invoked, passing in an object implementing the <code>INotification</code> interface,
     * such as a subclass of <code>Notification</code>.
     */
    class Observer implements IObserver {
        /**
         * The notification method of the interested object.
         */
        private notify;
        /**
         * The notification context of the interested object.
         */
        private context;
        /**
         * Constructs an <code>Observer</code> instance.
         *
         * @param notifyMethod
         * 		The notification method of the interested object.
         *
         * @param notifyContext
         * 		The notification context of the interested object.
         */
        constructor(notifyMethod: Function, notifyContext: any);
        /**
         * Get the notification method.
         *
         * @return
         * 		The notification (callback) method of the interested object.
         */
        private getNotifyMethod();
        /**
         * Set the notification method.
         *
         * The notification method should take one parameter of type <code>INotification</code>.
         *
         * @param notifyMethod
         * 		The notification (callback) method of the interested object.
         */
        setNotifyMethod(notifyMethod: Function): void;
        /**
         * Get the notification context.
         *
         * @return
         * 		The notification context (<code>this</code>) of the interested object.
         */
        private getNotifyContext();
        /**
         * Set the notification context.
         *
         * @param notifyContext
         * 		The notification context (this) of the interested object.
         */
        setNotifyContext(notifyContext: any): void;
        /**
         * Notify the interested object.
         *
         * @param notification
         * 		The <code>INotification</code> to pass to the interested object's notification
         * 		method.
         */
        notifyObserver(notification: INotification): void;
        /**
         * Compare an object to the notification context.
         *
         * @param object
         * 		The object to compare.
         *
         * @return
         * 		The object and the notification context are the same.
         */
        compareNotifyContext(object: any): boolean;
    }
}
declare module puremvc {
    /**
     * The <code>View</code> class for PureMVC.
     *
     * A multiton <code>IView</code> implementation.
     *
     * In PureMVC, the <code>View</code> class assumes these responsibilities:
     * <UL>
     * <LI>Maintain a cache of <code>IMediator</code> instances.
     * <LI>Provide methods for registering, retrieving, and removing <code>IMediator</code>s.
     * <LI>Notifiying <code>IMediator</code>s when they are registered or removed.
     * <LI>Managing the <code>Observer</code> lists for each <code>INotification</code> in the
     * application.
     * <LI>Providing a method for attaching <code>IObservers</code> to an
     * <code>INotification</code>'s <code>Observer</code> list.
     * <LI>Providing a method for broadcasting an <code>INotification</code>.
     * <LI>Notifying the <code>IObserver</code>s of a given <code>INotification</code> when it
     * broadcasts.
     */
    class View implements IView {
        /**
         * Mapping of <code>Mediator</code> names to <code>Mediator</code> instances.
         *
         * @protected
         */
        mediatorMap: Object;
        /**
         * Mapping of <code>Notification</code> names to <code>Observers</code> lists.
         *
         * @protected
         */
        observerMap: Object;
        /**
         * Multiton key for this <code>View</code> instance.
         *
         * @protected
         */
        multitonKey: string;
        /**
         * This <code>IView</code> implementation is a multiton, so you should not call the
         * constructor directly, but instead call the static multiton Factory method
         * <code>View.getInstance( key )</code>.
         *
         * @param key
         *		Multiton key for this instance of <code>View</code>.
         *
         * @throws Error
         *		Throws an error if an instance for this multiton key has already been constructed.
         */
        constructor(key: string);
        /**
         * Initialize the multiton <code>View</code> instance.
         *
         * Called automatically by the constructor. This is the opportunity to initialize the
         * multiton instance in a subclass without overriding the constructor.
         */
        initializeView(): void;
        /**
         * Register an <code>IObserver</code> to be notified of <code>INotifications</code> with a
         * given name.
         *
         * @param notificationName
         * 		The name of the <code>INotifications</code> to notify this <code>IObserver</code>
         * 		of.
         *
         * @param observer
         * 		The <code>IObserver</code> to register.
         */
        registerObserver(notificationName: string, observer: IObserver): void;
        /**
         * Remove a list of <code>IObserver</code>s for a given <code>notifyContext</code> from an
         * <code>IObserver</code> list for a given <code>INotification</code> name.
         *
         * @param notificationName
         * 		Which <code>IObserver</code> list to remove from.
         *
         * @param notifyContext
         * 		Remove the <code>IObserver</code> with this object as its
         *		<code>notifyContext</code>.
         */
        removeObserver(notificationName: string, notifyContext: any): void;
        /**
         * Notify the <code>IObserver</code>s for a particular <code>INotification</code>.
         *
         * All previously attached <code>IObserver</code>s for this <code>INotification</code>'s
         * list are notified and are passed a reference to the <code>INotification</code> in the
         * order in which they were registered.
         *
         * @param notification
         * 		The <code>INotification</code> to notify <code>IObserver</code>s of.
         */
        notifyObservers(notification: INotification): void;
        /**
         * Register an <code>IMediator</code> instance with the <code>View</code>.
         *
         * Registers the <code>IMediator</code> so that it can be retrieved by name, and further
         * interrogates the <code>IMediator</code> for its <code>INotification</code> interests.
         *
         * If the <code>IMediator</code> returns any <code>INotification</code> names to be
         * notified about, an <code>Observer</code> is created to encapsulate the
         * <code>IMediator</code> instance's <code>handleNotification</code> method and register
         * it as an <code>Observer</code> for all <code>INotification</code>s the
         * <code>IMediator</code> is interested in.
         *
         * @param mediator
         * 		A reference to an <code>IMediator</code> implementation instance.
         */
        registerMediator(mediator: IMediator): void;
        /**
         * Retrieve an <code>IMediator</code> from the <code>View</code>.
         *
         * @param mediatorName
         * 		The name of the <code>IMediator</code> instance to retrieve.
         *
         * @return
         * 		The <code>IMediator</code> instance previously registered with the given
         *		<code>mediatorName</code> or an explicit <code>null</code> if it doesn't exists.
         */
        retrieveMediator(mediatorName: string): IMediator;
        /**
         * Remove an <code>IMediator</code> from the <code>View</code>.
         *
         * @param mediatorName
         * 		Name of the <code>IMediator</code> instance to be removed.
         *
         * @return
         *		The <code>IMediator</code> that was removed from the <code>View</code> or a
         *		strict <code>null</null> if the <code>Mediator</code> didn't exist.
         */
        removeMediator(mediatorName: string): IMediator;
        /**
         * Check if a <code>IMediator</code> is registered or not.
         *
         * @param mediatorName
         * 		The <code>IMediator</code> name to check whether it is registered.
         *
         * @return
         *		An <code>IMediator</code> is registered with the given <code>mediatorName</code>.
         */
        hasMediator(mediatorName: string): boolean;
        /**
         * Error message used to indicate that a <code>View</code> singleton instance is
         * already constructed for this multiton key.
         *
         * @constant
         * @protected
         */
        static MULTITON_MSG: string;
        /**
         * <code>View</code> singleton instance map.
         *
         * @protected
         */
        static instanceMap: Object;
        /**
         * <code>View</code> multiton factory method.
         *
         * @param key
         *		The multiton key of the instance of <code>View</code> to create or retrieve.
         *
         * @return
         *		The singleton instance of <code>View</code>.
         */
        static getInstance(key: string): IView;
        /**
         * Remove a <code>View</code> instance.
         *
         * @param key
         * 		Key identifier of <code>View</code> instance to remove.
         */
        static removeView(key: string): void;
    }
}
declare module puremvc {
    /**
     * The <code>Controller</code> class for PureMVC.
     *
     * A multiton <code>IController</code> implementation.
     *
     * In PureMVC, the <code>Controller</code> class follows the 'Command and Controller' strategy,
     * and assumes these responsibilities:
     *
     * <UL>
     * <LI>Remembering which <code>ICommand</code>s are intended to handle which
     * <code>INotification</code>s.
     * <LI>Registering itself as an <code>IObserver</code> with the <code>View</code> for each
     * <code>INotification</code> that it has an <code>ICommand</code> mapping for.
     * <LI>Creating a new instance of the proper <code>ICommand</code> to handle a given
     * <code>INotification</code> when notified by the <code>View</code>.
     * <LI>Calling the <code>ICommand</code>'s <code>execute</code> method, passing in the
     * <code>INotification</code>.
     *
     * Your application must register <code>ICommand</code>s with the <code>Controller</code>.
     *
     * The simplest way is to subclass </code>Facade</code>, and use its
     * <code>initializeController</code> method to add your registrations.
     */
    class Controller implements IController {
        /**
         * Local reference to the <code>View</code> singleton.
         *
         * @protected
         */
        view: IView;
        /**
         * Mapping of <code>Notification<code> names to <code>Command</code> constructors references.
         *
         * @protected
         */
        commandMap: Object;
        /**
         * The multiton Key for this Core.
         *
         * @protected
         */
        multitonKey: string;
        /**
         * Constructs a <code>Controller</code> instance.
         *
         * This <code>IController</code> implementation is a multiton, so you should not call the
         * constructor directly, but instead call the static multiton Factory method
         * <code>Controller.getInstance( key )</code>.
         *
         * @param key
         *		Multiton key for this instance of <code>Controller</code>
         *
         * @throws Error
         * 		Throws an error if an instance for this multiton key has already been constructed.
         */
        constructor(key: string);
        /**
         * Initialize the multiton <code>Controller</code> instance.
         *
         * Called automatically by the constructor.
         *
         * Note that if you are using a subclass of <code>View</code> in your application, you
         * should <i>also</i> subclass <code>Controller</code> and override the
         * <code>initializeController</code> method in the following way:
         *
         * <pre>
         *		// Ensure that the Controller is talking to my <code>IView</code> implementation.
         *		initializeController():void
         *		{
         *			this.view = MyView.getInstance( this.multitonKey );
         *		}
         * </pre>
         *
         * @protected
         */
        initializeController(): void;
        /**
         * If an <code>ICommand</code> has previously been registered to handle the given
         * <code>INotification</code>, then it is executed.
         *
         * @param notification
         * 		The <code>INotification</code> the command will receive as parameter.
         */
        executeCommand(notification: INotification): void;
        /**
         * Register a particular <code>ICommand</code> class as the handler for a particular
         * <code>INotification</code>.
         *
         * If an <code>ICommand</code> has already been registered to handle
         * <code>INotification</code>s with this name, it is no longer used, the new
         * <code>ICommand</code> is used instead.
         *
         * The <code>Observer</code> for the new <code>ICommand</code> is only created if this is
         * the first time an <code>ICommand</code> has been registered for this
         * <code>Notification</code> name.
         *
         * @param notificationName
         * 		The name of the <code>INotification</code>.
         *
         * @param commandClassRef
         * 		The constructor of the <code>ICommand</code>.
         */
        registerCommand(notificationName: string, commandClassRef: Function): void;
        /**
         * Check if an <code>ICommand</code> is registered for a given <code>Notification</code>.
         *
         * @param notificationName
         * 		Name of the <code>Notification</code> to check wheter an <code>ICommand</code> is
         * 		registered for.
         *
         * @return
         * 		An <code>ICommand</code> is currently registered for the given
         * 		<code>notificationName</code>.
         */
        hasCommand(notificationName: string): boolean;
        /**
         * Remove a previously registered <code>ICommand</code> to <code>INotification</code>
         * mapping.
         *
         * @param notificationName
         * 		The name of the <code>INotification</code> to remove the <code>ICommand</code>
         * 		mapping for.
         */
        removeCommand(notificationName: string): void;
        /**
         * Error message used to indicate that a <code>Controller</code> singleton instance is
         * already constructed for this multiton key.
         *
         * @protected
         * @constant
         */
        static MULTITON_MSG: string;
        /**
         * <code>Controller</code> singleton instance map.
         *
         * @protected
         */
        static instanceMap: Object;
        /**
         * <code>Controller</code> multiton factory method.
         *
         * @param key
         *		The multiton key of the instance of <code>Controller</code> to create or retrieve.
         *
         * @return
         * 		The multiton instance of <code>Controller</code>
         */
        static getInstance(key: string): IController;
        /**
         * Remove a <code>Controller</code> instance.
         *
         * @param key
         *		Multiton key of the <code>Controller</code> instance to remove.
         */
        static removeController(key: string): void;
    }
}
declare module puremvc {
    /**
     * The <code>Model</code> class for PureMVC.
     *
     * A multiton <code>IModel</code> implementation.
     *
     * In PureMVC, the <code>IModel</code> class provides access to model objects
     * <code>Proxie</code>s by named lookup.
     *
     * The <code>Model</code> assumes these responsibilities:
     * <UL>
     * <LI>Maintain a cache of <code>IProxy</code> instances.
     * <LI>Provide methods for registering, retrieving, and removing <code>Proxy</code> instances.
     *
     * Your application must register <code>IProxy</code> instances with the <code>Model</code>.
     * Typically, you use an <code>ICommand</code> to create and register <code>Proxy</code> instances
     * once the <code>Facade</code> has initialized the core actors.
     */
    class Model implements IModel {
        /**
         * HashTable of <code>IProxy</code> registered with the <code>Model</code>.
         *
         * @protected
         */
        proxyMap: Object;
        /**
         * The multiton key for this core.
         *
         * @protected
         */
        multitonKey: string;
        /**
         * This <code>IModel</code> implementation is a multiton, so you should not call the
         * constructor directly, but instead call the static multiton Factory method
         * <code>Model.getInstance( key )</code>.
         *
         * @param key
         *		Multiton key for this instance of <code>Model</code>.
         *
         * @throws Error
         * 		Throws an error if an instance for this multiton key has already been constructed.
         */
        constructor(key: string);
        /**
         * Initialize the multiton <code>Model</code> instance.
         *
         * Called automatically by the constructor. This is the opportunity to initialize the
         * multiton instance in a subclass without overriding the constructor.
         *
         * @protected
         */
        initializeModel(): void;
        /**
         * Register an <code>IProxy</code> with the <code>Model</code>.
         *
         * @param proxy
         *		An <code>IProxy</code> to be held by the <code>Model</code>.
         */
        registerProxy(proxy: IProxy): void;
        /**
         * Remove an <code>IProxy</code> from the <code>Model</code>.
         *
         * @param proxyName
         *		The name of the <code>Proxy</code> instance to be removed.
         *
         * @return
         *		The <code>IProxy</code> that was removed from the <code>Model</code> or an
         *		explicit <code>null</null> if the <code>IProxy</code> didn't exist.
         */
        removeProxy(proxyName: string): IProxy;
        /**
         * Retrieve an <code>IProxy</code> from the <code>Model</code>.
         *
         * @param proxyName
         *		 The <code>IProxy</code> name to retrieve from the <code>Model</code>.
         *
         * @return
         *		The <code>IProxy</code> instance previously registered with the given
         *		<code>proxyName</code> or an explicit <code>null</code> if it doesn't exists.
         */
        retrieveProxy(proxyName: string): IProxy;
        /**
         * Check if an <code>IProxy</code> is registered.
         *
         * @param proxyName
         *		The name of the <code>IProxy</code> to verify the existence of its registration.
         *
         * @return
         *		A Proxy is currently registered with the given <code>proxyName</code>.
         */
        hasProxy(proxyName: string): boolean;
        /**
         * Error message used to indicate that a <code>Model</code> singleton instance is
         * already constructed for this multiton key.
         *
         * @constant
         * @protected
         */
        static MULTITON_MSG: string;
        /**
         * <code>Model</code> singleton instance map.
         *
         * @protected
         */
        static instanceMap: Object;
        /**
         * <code>Model</code> multiton factory method.
         *
         * @param key
         *		The multiton key of the instance of <code>Model</code> to create or retrieve.
         *
         * @return
         * 		The singleton instance of the <code>Model</code>.
         */
        static getInstance(key: any): IModel;
        /**
         * Remove a <code>Model</code> instance
         *
         * @param key
         *		Multiton key identifier for the <code>Model</code> instance to remove.
         */
        static removeModel(key: any): void;
    }
}
declare module puremvc {
    /**
     * A base <code>INotifier</code> implementation.
     *
     * <code>MacroCommand</code>, <code>SimpleCommand</code>, <code>Mediator</code> and
     * <code>Proxy</code> all have a need to send <code>Notifications</code>.
     *
     * The <code>INotifier</code> interface provides a common method called
     * <code>sendNotification</code> that relieves implementation code of the necessity to actually
     * construct <code>Notification</code>s.
     *
     * The <code>INotifier</code> interface, which all of the above mentioned classes extend,
     * provides an initialized reference to the <code>Facade</code> singleton, which is required by
     * the convenience method <code>sendNotification</code>	for sending <code>Notifications</code>,
     * but it also eases implementation as these classes have frequent <code>Facade</code>
     * interactions and usually require access to the facade anyway.
     *
     * NOTE: In the MultiCore version of the framework, there is one caveat to notifiers, they
     * cannot send notifications or reach the facade until they have a valid multitonKey.
     *
     * The multitonKey is set:
     * <UL>
     * <LI>On a <code>ICommand</code> when it is executed by the <code>Controller</code>.
     * <LI>On a <code>IMediator</code> is registered with the <code>View</code>.
     * <LI>On a <code>IProxy</code> is registered with the <code>Model</code>.
     */
    class Notifier implements INotifier {
        /**
         * The multiton key for this core.
         *
         * @protected
         */
        multitonKey: string;
        /**
         * Initialize a <code>Notifier</code> instance with its cor multiton key.
         *
         * This is how a <code>Notifier</code> gets its multiton key. Calls to
         * <code>sendNotification <code> or to access the facade will fail until after this method
         * has been called.
         *
         * <code>Mediator</code>s, <code>Command</code>s or <code>Proxies</code> may override
         * this method in order to send notifications or access the multiton Facade instance as
         * soon as possible. They CANNOT access the facade in their constructors, since this
         * method will not yet have been called.
         *
         * @param key
         *		The multiton key for this <code>Notifier</code> to use.
         */
        initializeNotifier(key: any): void;
        /**
         * Create and send a <code>Notification</code>.
         *
         * Keeps us from having to construct new <code>Notification</code> instances in our
         * implementation code.
         *
         * @param name
         * 		The name of the notification to send.
         *
         * @param body
         * 		The body of the notification.
         *
         * @param type
         * 		The type of the notification.
         */
        sendNotification(name: string, body?: any, type?: string): void;
        /**
         * Return the multiton <code>Facade</code> instance.
         *
         * @return
         *		The multiton <code>Facade</code> instance.
         *
         * @throws
         *		Throws an error if the multiton key for this Notifier is not yet initialized.
         */
        facade(): IFacade;
        /**
         * Message Constants
         *
         * @constant
         * @protected
         */
        static MULTITON_MSG: string;
    }
}
declare module puremvc {
    /**
     * A base <code>INotification</code> implementation.
     *
     * PureMVC does not rely upon underlying event models such as the one provided in JavaScript DOM API,
     * and TypeScript does not have an inherent event model.
     *
     * The Observer pattern as implemented within PureMVC exists to support event-driven
     * communication between the application and the actors of the MVC triad (Model, View and
     * Controller).
     *
     * Notifications are not meant to be a replacement for Events in Javascript.
     * Generally, <code>IMediator</code> implementors place event listeners on their view components,
     * which they then handle in the usual way. This may lead to the broadcast of
     * <code>INotification</code>s to trigger <code>ICommand</code>s or to communicate with other
     * <code>IMediators</code>. <code>IProxy</code> and <code>ICommand</code> instances communicate
     * with each other and <code>IMediator</code>s by broadcasting <code>INotification</code>s.
     *
     * A key difference between JavaScript <code>Event</code>s and PureMVC
     * <code>INotification</code>s is that <code>Event</code>s follow the 'Chain of Responsibility'
     * pattern, 'bubbling' up the display hierarchy until some parent component handles the
     * <code>Event</code>, while PureMVC <code>INotification</code>s follow a 'Publish/Subscribe'
     * pattern. PureMVC classes need not be related to each other in a parent/child relationship in
     * order to communicate with one another using <code>INotification</code>s.
     */
    class Notification implements INotification {
        /**
         * The name of the <code>Notification</code>.
         */
        private name;
        /**
         * The body data to send with the <code>Notification</code>.
         */
        private body;
        /**
         * The type identifier of the <code>Notification</code>.
         */
        private type;
        /**
         * Constructs a <code>Notification</code> instance.
         *
         * @param name
         * 		The name of the notification.
         *
         * @param body
         * 		Body data to send with the <code>Notification</code>.
         *
         * @param type
         * 		Type identifier of the <code>Notification</code>.
         */
        constructor(name: string, body?: any, type?: string);
        /**
         * Get the name of the <code>Notification</code> instance.
         *
         * @return
         *		The name of the <code>Notification</code> instance.
         */
        getName(): string;
        /**
         * Set the body of the <code>Notification</code> instance.
         *
         * @param body
         * 		The body of the <code>Notification</code> instance.
         */
        setBody(body: any): void;
        /**
         * Get the body of the <code>Notification</code> instance.
         *
         * @return
         *		The body object of the <code>Notification</code> instance.
         */
        getBody(): any;
        /**
         * Set the type of the <code>Notification</code> instance.
         *
         * @param type
         * 		The type of the <code>Notification</code> instance.
         */
        setType(type: string): void;
        /**
         * Get the type of the <code>Notification</code> instance.
         *
         * @return
         *		The type of the <code>Notification</code> instance.
         */
        getType(): string;
        /**
         * Get a textual representation of the <code>Notification</code> instance.
         *
         * @return
         * 		The textual representation of the <code>Notification</code>	instance.
         */
        toString(): string;
    }
}
declare module puremvc {
    /**
     * A base <code>ICommand</code> implementation that executes other <code>ICommand</code>s.
     *
     * A <code>MacroCommand</code> maintains an list of <code>ICommand</code> constructor references
     * called <i>SubCommand</i>s.
     *
     * When <code>execute</code> is called, the <code>MacroCommand</code> instantiates and calls
     * <code>execute</code> on each of its <i>SubCommands</i> turn. Each <i>SubCommand</i> will be
     * passed a reference to the original <code>INotification</code> that was passed to the
     * <code>MacroCommand</code>'s <code>execute</code> method.
     *
     * Unlike <code>SimpleCommand</code>, your subclass should not override <code>execute</code>,
     * but instead, should override the <code>initializeMacroCommand</code> method, calling
     * <code>addSubCommand</code> once for each <i>SubCommand</i> to be executed.
     */
    class MacroCommand extends Notifier implements ICommand, INotifier {
        /**
         * An array of <code>ICommand</code>s.
         *
         * @protected
         */
        subCommands: Function[];
        /**
         * Constructs a <code>MacroCommand</code> instance.
         *
         * You should not need to define a constructor in your subclasses, instead, override the
         * <code>initializeMacroCommand</code> method.
         *
         * If your subclass does define a constructor, be  sure to call <code>super()</code>.
         */
        constructor();
        /**
         * Initialize the <code>MacroCommand</code>.
         *
         * In your subclass, override this method to  initialize the <code>MacroCommand</code>'s
         * <i>subCommand</i> list with <code>ICommand</code> class references like this:
         *
         * <pre>
         *		// Initialize MyMacroCommand
         *		initializeMacroCommand():void
         *		{
         *			this.addSubCommand( FirstCommand );
         *			this.addSubCommand( SecondCommand );
         *			this.addSubCommand( ThirdCommand );
         *		}
         * </pre>
         *
         * Note that <i>subCommand</i>s may be any <code>ICommand</code> implementor so
         * <code>MacroCommand</code>s or <code>SimpleCommand</code>s are both acceptable.
         *
         * @protected
         */
        initializeMacroCommand(): void;
        /**
         * Add an entry to the <i>subCommands</i> list.
         *
         * The <i>subCommands</i> will be called in First In/First Out (FIFO) order.
         *
         * @param commandClassRef
         *		A reference to the constructor of the <code>ICommand</code>.
         *
         * @protected
         */
        addSubCommand(commandClassRef: Function): void;
        /**
         * Execute this <code>MacroCommand</code>'s <i>SubCommands</i>.
         *
         * The <i>SubCommands</i> will be called in First In/First Out (FIFO)
         * order.
         *
         * @param notification
         *		The <code>INotification</code> object to be passed to each <i>SubCommand</i> of
         *		the list.
         *
         * @final
         */
        execute(notification: INotification): void;
    }
}
declare module puremvc {
    /**
     * A base <code>ICommand</code> implementation.
     *
     * Your subclass should override the <code>execute</code> method where your business logic will
     * handle the <code>INotification</code>.
     */
    class SimpleCommand extends Notifier implements ICommand, INotifier {
        /**
         * Fulfill the use-case initiated by the given <code>INotification</code>.
         *
         * In the Command Pattern, an application use-case typically begins with some user action,
         * which results in an <code>INotification</code> being broadcast, which is handled by
         * business logic in the <code>execute</code> method of an <code>ICommand</code>.
         *
         * @param notification
         * 		The <code>INotification</code> to handle.
         */
        execute(notification: INotification): void;
    }
}
declare module puremvc {
    /**
     * A base multiton <code>IFacade</code> implementation.
     *
     * In PureMVC, the <code>Facade</code> class assumes these responsibilities:
     *
     * <UL>
     * <LI>Initializing the <code>Model</code>, <code>View</code> and <code>Controller</code>
     * singletons.
     * <LI>Providing all the methods defined by the <code>IModel</code>, <code>IView</code>, &
     * <code>IController</code> interfaces.
     * <LI>Providing the ability to override the specific <code>Model</code>, <code>View</code> and
     * <code>Controller</code> multitons created.
     * <LI>Providing a single point of contact to the application for registering
     * <code>ICommand</code>s and notifying <code>IObserver</code>s.
     *
     * This <code>Facade</code> implementation is a multiton instance and cannot be instantiated directly,
     * but instead calls the static multiton factory method <code>Facade.getInstance( key )</code>.
     */
    class Facade implements IFacade {
        /**
         * Local reference to the <code>Model</code> multiton.
         *
         * @protected
         */
        model: IModel;
        /**
         * Local reference to the <code>View</code> multiton.
         *
         * @protected
         */
        view: IView;
        /**
         * Local reference to the <code>Controller</code> multiton.
         *
         * @protected
         */
        controller: IController;
        /**
         * The multiton Key for this Core.
         *
         * @protected
         */
        multitonKey: string;
        /**
         * Constructs a <code>Controller</code> instance.
         *
         * This <code>IFacade</code> implementation is a multiton, so you should not call the
         * constructor directly, but instead call the static multiton factory method
         * <code>Facade.getInstance( key )</code>.
         *
         *
         * @param key
         *		Multiton key for this instance of <code>Facade</code>
         *
         * @throws Error
         *		Throws an error if an instance for this multiton key has already been constructed.
         */
        constructor(key: any);
        /**
         * Called automatically by the constructor.
         * Initialize the singleton <code>Facade</code> instance.
         *
         * Override in your subclass to do any subclass specific initializations. Be sure to
         * extend the <code>Facade</code> with the methods and properties on your implementation
         * and call <code>Facade.initializeFacade()</code>.
         *
         * @protected
         */
        initializeFacade(): void;
        /**
         * Initialize the <code>Model</code>.
         *
         * Called by the <code>initializeFacade</code> method. Override this method in your
         * subclass of <code>Facade</code> if one or both of the following are true:
         *
         * <UL>
         * <LI> You wish to initialize a different <code>IModel</code>.
         * <LI> You have <code>Proxy</code>s to register with the <code>Model</code> that do not
         * retrieve a reference to the <code>Facade</code> at construction time.
         *
         * If you don't want to initialize a different <code>IModel</code>, call
         * <code>super.initializeModel()</code> at the beginning of your method, then register
         * <code>Proxy</code>s.
         *
         * Note: This method is <i>rarely</i> overridden; in practice you are more likely to use a
         * <code>Command</code> to create and register <code>Proxy</code>s with the
         * <code>Model</code>, since <code>Proxy</code>s with mutable data will likely need to send
         * <code>INotification</code>s and thus will likely want to fetch a reference to the
         * <code>Facade</code> during their construction.
         *
         * @protected
         */
        initializeModel(): void;
        /**
         * Initialize the <code>Controller</code>.
         *
         * Called by the <code>initializeFacade</code> method. Override this method in your
         * subclass of <code>Facade</code> if one or both of the following are true:
         *
         * <UL>
         * <LI>You wish to initialize a different <code>IController</code>.
         * <LI>You have <code>ICommand</code>s to register with the <code>Controller</code> at
         * startup.
         *
         * If you don't want to initialize a different <code>IController</code>, call
         * <code>super.initializeController()</code> at the beginning of your method, then register
         * <code>Command</code>s.
         *
         * @protected
         */
        initializeController(): void;
        /**
         * Initialize the <code>View</code>.
         *
         * Called by the <code>initializeFacade</code> method. Override this method in your
         * subclass of <code>Facade</code> if one or both of the following are true:
         * <UL>
         * <LI> You wish to initialize a different <code>IView</code>.
         * <LI> You have <code>Observers</code> to register with the <code>View</code>
         *
         * If you don't want to initialize a different <code>IView</code>, call
         * <code>super.initializeView()</code> at the beginning of your method, then register
         * <code>IMediator</code> instances.
         *
         * Note: This method is <i>rarely</i> overridden; in practice you are more likely to use a
         * <code>Command</code> to create and register <code>Mediator</code>s with the
         * <code>View</code>, since <code>IMediator</code> instances will need to send
         * <code>INotification</code>s and thus will likely want to fetch a reference to the
         * <code>Facade</code> during their construction.
         *
         * @protected
         */
        initializeView(): void;
        /**
         * Register an <code>ICommand</code> with the <code>IController</code> associating it to a
         * <code>INotification</code> name.
         *
         * @param notificationName
         *		The name of the <code>INotification</code> to associate the <code>ICommand</code>
         *		with.
         
         * @param commandClassRef
         * 		A reference to the constructor of the <code>ICommand</code>.
         */
        registerCommand(notificationName: string, commandClassRef: Function): void;
        /**
         * Remove a previously registered <code>ICommand</code> to <code>INotification</code>
         * mapping from the <code>Controller</code>.
         *
         * @param notificationName
         *		The name of the <code>INotification</code> to remove the <code>ICommand</code>
         *		mapping for.
         */
        removeCommand(notificationName: string): void;
        /**
         * Check if an <code>ICommand</code> is registered for a given <code>Notification</code>.
         *
         * @param notificationName
         * 		The name of the <code>INotification</code> to verify for the existence of an
         * 		<code>ICommand</code> mapping for.
         *
         * @return
         * 		A <code>Command</code> is currently registered for the given
         *		<code>notificationName</code>.
         */
        hasCommand(notificationName: string): boolean;
        /**
         * Register an <code>IProxy</code> with the <code>Model</code> by name.
         *
         * @param proxy
         *		The <code>IProxy</code> to be registered with the <code>Model</code>.
         */
        registerProxy(proxy: IProxy): void;
        /**
         * Retrieve an <code>IProxy</code> from the <code>Model</code> by name.
         *
         * @param proxyName
         * 		The name of the <code>IProxy</code> to be retrieved.
         *
         * @return
         * 		The <code>IProxy</code> previously registered with the given
         *		<code>proxyName</code>.
         */
        retrieveProxy(proxyName: string): IProxy;
        /**
         * Remove an <code>IProxy</code> from the <code>Model</code> by name.
         *
         * @param proxyName
         *		The <code>IProxy</code> to remove from the <code>Model</code>.
         *
         * @return
         *		The <code>IProxy</code> that was removed from the <code>Model</code>
         */
        removeProxy(proxyName: string): IProxy;
        /**
         * Check if a <code>Proxy</code> is registered.
         *
         * @param proxyName
         * 		The <code>IProxy</code> to verify the existence of a registration with the
         *		<code>IModel</code>.
         *
         * @return
         * 		A <code>Proxy</code> is currently registered with the given	<code>proxyName</code>.
         */
        hasProxy(proxyName: string): boolean;
        /**
         * Register a <code>IMediator</code> with the <code>IView</code>.
         *
         * @param mediator
         *		A reference to the <code>IMediator</code>.
         */
        registerMediator(mediator: IMediator): void;
        /**
         * Retrieve an <code>IMediator</code> from the <code>IView</code>.
         *
         * @param mediatorName
         * 		The name of the registered <code>Mediator</code> to retrieve.
         *
         * @return
         *		The <code>IMediator</code> previously registered with the given
         *		<code>mediatorName</code>.
         */
        retrieveMediator(mediatorName: string): IMediator;
        /**
         * Remove an <code>IMediator</code> from the <code>IView</code>.
         *
         * @param mediatorName
         * 		Name of the <code>IMediator</code> to be removed.
         *
         * @return
         *		The <code>IMediator</code> that was removed from the <code>IView</code>
         */
        removeMediator(mediatorName: string): IMediator;
        /**
         * Check if a <code>Mediator</code> is registered or not
         *
         * @param mediatorName
         * 		The name of the <code>IMediator</code> to verify the existence of a registration
         *		for.
         *
         * @return
         * 		An <code>IMediator</code> is registered with the given <code>mediatorName</code>.
         */
        hasMediator(mediatorName: string): boolean;
        /**
         * Notify the <code>IObserver</code>s for a particular <code>INotification</code>.
         *
         * This method is left public mostly for backward compatibility, and to allow you to
         * send custom notification classes using the <code>Facade</code>.
         *
         *
         * Usually you should just call <code>sendNotification</code> and pass the parameters,
         * never having to construct the <code>INotification</code> yourself.
         *
         * @param notification
         * 		The <code>INotification</code> to have the <code>IView</code> notify
         *		<code>IObserver</code>s	of.
         */
        notifyObservers(notification: INotification): void;
        /**
         * Create and send an <code>INotification</code>.
         *
         * Keeps us from having to construct new notification instances in our implementation code.
         *
         * @param name
         *		The name of the notification to send.
         *
         * @param body
         *		The body of the notification to send.
         *
         * @param type
         *		The type of the notification to send.
         */
        sendNotification(name: string, body?: any, type?: string): void;
        /**
         * Set the multiton key for this <code>Facade</code> instance.
         *
         * Not called directly, but instead from the constructor when
         * <code>Facade.getInstance(key)</code> is invoked.
         *
         * @param key
         *		The multiton key for this <code>Facade</code> instance to initialize the
         *		<code>Notifier</code> with.
         */
        initializeNotifier(key: string): void;
        /**
         * @constant
         * @protected
         */
        static MULTITON_MSG: string;
        /**
         * <code>Facade</code> singleton instance map.
         *
         * @protected
         */
        static instanceMap: Object;
        /**
         * <code>Facade</code> multiton factory method.
         *
         * @param key
         *		The multiton key of the instance of <code>Facade</code> to create or retrieve.
         *
         * @return
         * 		The singleton instance of <code>Facade</code>.
         */
        static getInstance(key: string): IFacade;
        /**
         * Check if a core is registered or not.
         *
         * @param key
         *		The multiton key for the Core in question.
         *
         * @return
         *		The core is registered with the given <code>key</code>.
         */
        static hasCore(key: string): boolean;
        /**
         * Remove a core.
         *
         * Remove the <code>Model</code>, <code>View</code>, <code>Controller</code> and
         * <code>Facade</code> instances for the given key.
         *
         * @param key
         *		Key identifier of the core to remove.
         */
        static removeCore(key: string): void;
    }
}
declare module puremvc {
    /**
     * A base <code>IMediator</code> implementation.
     *
     * Typically, a <code>Mediator</code> will be written to serve one specific control or group
     * controls and so, will not have a need to be dynamically named.
     */
    class Mediator extends Notifier implements IMediator, INotifier {
        /**
         * The name of the <code>Mediator</code>.
         *
         * @protected
         */
        mediatorName: string;
        /**
         * The <code>Mediator</code>'s view component.
         *
         * @protected
         */
        viewComponent: any;
        /**
         * Constructs a <code>Mediator</code> instance.
         *
         * @param mediatorName
         * 		The name of the <code>Mediator</code>.
         *
         * @param viewComponent
         * 		The view component handled by this <code>Mediator</code>.
         */
        constructor(mediatorName?: string, viewComponent?: any);
        /**
         * Get the <code>Mediator</code> instance name.
         *
         * @return
         * 		The <code>Mediator</code> instance name
         */
        getMediatorName(): string;
        /**
         * Get the <code>Mediator</code>'s view component.
         *
         * Additionally, an implicit getter will usually be defined in the subclass that casts the
         * view object to a type, like this:
         *
         * <code>
         *		getMenu():Menu
         *		{
         *			return <Menu> this.viewComponent;
         *		}
         * </code>
         *
         * @return
         * 		The <code>Mediator</code>'s default view component.
         */
        getViewComponent(): any;
        /**
         * Set the <code>IMediator</code>'s view component.
         *
         * @param viewComponent
         * 		The default view component to set for this <code>Mediator</code>.
         */
        setViewComponent(viewComponent: any): void;
        /**
         * List the <code>INotification</code> names this <code>IMediator</code> is interested in
         * being notified of.
         *
         * @return
         * 		The list of notifications names in which is interested the <code>Mediator</code>.
         */
        listNotificationInterests(): string[];
        /**
         * Handle <code>INotification</code>s.
         *
         *
         * Typically this will be handled in a switch statement, with one 'case' entry per
         * <code>INotification</code> the <code>Mediator</code> is interested in.
         *
         * @param notification
         * 		The notification instance to be handled.
         */
        handleNotification(notification: INotification): void;
        /**
         * Called by the View when the Mediator is registered. This method has to be overridden
         * by the subclass to know when the instance is registered.
         */
        onRegister(): void;
        /**
         * Called by the View when the Mediator is removed. This method has to be overridden
         * by the subclass to know when the instance is removed.
         */
        onRemove(): void;
        /**
         * Default name of the <code>Mediator</code>.
         *
         * @constant
         */
        static NAME: string;
    }
}
declare module puremvc {
    /**
     * A base <code>IProxy</code> implementation.
     *
     * In PureMVC, <code>IProxy</code> implementors assume these responsibilities:
     * <UL>
     * <LI>Implement a common method which returns the name of the <code>Proxy</code>.
     * <LI>Provide methods for setting and getting the data object.
     *
     * Additionally, <code>IProxy</code> typically:
     * <UL>
     * <LI>Maintain references to one or more pieces of model data.
     * <LI>Provide methods for manipulating that data.
     * <LI>Generate <code>INotification</code>s when their model data changes.
     * <LI>Expose their name as a <code>constant</code> called <code>NAME</code>, if they are not
     * instantiated multiple times.
     * <LI>Encapsulate interaction with local or remote services used to fetch and persist model
     * data.
     */
    class Proxy extends Notifier implements IProxy, INotifier {
        /**
         * The name of the <code>Proxy</code>.
         *
         * @protected
         */
        proxyName: string;
        /**
         * The data object controlled by the <code>Proxy</code>.
         *
         * @protected
         */
        data: any;
        /**
         * Constructs a <code>Proxy</code> instance.
         *
         * @param proxyName
         * 		The name of the <code>Proxy</code> instance.
         *
         * @param data
         * 		An initial data object to be held by the <code>Proxy</code>.
         */
        constructor(proxyName?: string, data?: any);
        /**
         * Get the name of the <code>Proxy></code> instance.
         *
         * @return
         * 		The name of the <code>Proxy></code> instance.
         */
        getProxyName(): string;
        /**
         * Set the data of the <code>Proxy></code> instance.
         *
         * @param data
         * 		The data to set for the <code>Proxy></code> instance.
         */
        setData(data: any): void;
        /**
         * Get the data of the <code>Proxy></code> instance.
         *
         * @return
         * 		The data held in the <code>Proxy</code> instance.
         */
        getData(): any;
        /**
         * Called by the Model when the <code>Proxy</code> is registered. This method has to be
         * overridden by the subclass to know when the instance is registered.
         */
        onRegister(): void;
        /**
         * Called by the Model when the <code>Proxy</code> is removed. This method has to be
         * overridden by the subclass to know when the instance is removed.
         */
        onRemove(): void;
        /**
         * The default name of the <code>Proxy</code>
         *
         * @type
         * @constant
         */
        static NAME: string;
    }
}
